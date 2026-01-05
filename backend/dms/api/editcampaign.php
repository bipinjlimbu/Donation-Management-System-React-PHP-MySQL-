<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized. Please login."
    ]);
    exit;
}

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$user_id = (int) $_SESSION['user_id'];
$campaignId = (int) ($data['campaign_id'] ?? 0);
$title = trim($data['title'] ?? '');
$description = trim($data['description'] ?? '');
$targetQuantity = (int) ($data['target_quantity'] ?? 0);
$endDate = trim($data['end_date'] ?? '');
$status = trim($data['status'] ?? '');

if (!$campaignId || !$title || !$description || !$targetQuantity || !$endDate) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

try {
    // 🔐 Verify ownership
    $check = $conn->prepare(
        "SELECT campaign_id FROM campaigns 
         WHERE campaign_id = :cid AND created_by = :uid"
    );
    $check->bindParam(':cid', $campaignId, PDO::PARAM_INT);
    $check->bindParam(':uid', $user_id, PDO::PARAM_INT);
    $check->execute();

    if (!$check->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "You are not authorized to edit this campaign."
        ]);
        exit;
    }

    $sql = "UPDATE campaigns 
            SET title = :title,
                description = :description,
                target_quantity = :targetQuantity,
                end_date = :endDate,
                status = :status
            WHERE campaign_id = :campaignId";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':targetQuantity', $targetQuantity, PDO::PARAM_INT);
    $stmt->bindParam(':endDate', $endDate);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':campaignId', $campaignId, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Campaign updated successfully."
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
}
