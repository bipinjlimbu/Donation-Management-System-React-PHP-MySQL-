<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

$donor_id = (int) $_SESSION['user_id'];
$campaign_id = (int) ($data['campaign_id'] ?? 0);
$quantity = (int) ($data['quantity'] ?? 0);

if (!$campaign_id || $quantity <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid campaign or quantity."
    ]);
    exit;
}

try {
    $roleCheck = $conn->prepare(
        "SELECT role FROM users WHERE user_id = :uid"
    );
    $roleCheck->bindParam(':uid', $donor_id, PDO::PARAM_INT);
    $roleCheck->execute();
    $user = $roleCheck->fetch(PDO::FETCH_ASSOC);

    if (!$user || $user['role'] !== 'Donor') {
        echo json_encode([
            "success" => false,
            "message" => "Only donors can donate."
        ]);
        exit;
    }

    $campaignCheck = $conn->prepare(
        "SELECT campaign_id FROM campaigns 
         WHERE campaign_id = :cid AND status = 'Active'"
    );
    $campaignCheck->bindParam(':cid', $campaign_id, PDO::PARAM_INT);
    $campaignCheck->execute();

    if (!$campaignCheck->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Campaign not found or inactive."
        ]);
        exit;
    }

    $stmt = $conn->prepare(
        "INSERT INTO donations (donor_id, campaign_id, quantity, status)
         VALUES (:donor_id, :campaign_id, :quantity, 'Pending')"
    );
    $stmt->bindParam(':donor_id', $donor_id, PDO::PARAM_INT);
    $stmt->bindParam(':campaign_id', $campaign_id, PDO::PARAM_INT);
    $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Donation request submitted successfully."
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
}
