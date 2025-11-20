<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$campaignId = (int) ($data['campaign_id'] ?? 0);
$title = trim($data['title'] ?? '');
$description = trim($data['description'] ?? '');
$targetQuantity = (int) ($data['target_quantity'] ?? 0);
$endDate = trim($data['end_date'] ?? '');
$status = trim($data['status'] ?? '');

if ($campaignId <= 0 || !$title || !$description || !$targetQuantity || !$endDate) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required and campaign ID must be valid."
    ]);
    exit;
}

try {
    $sql = "UPDATE Campaigns SET title = :title, description = :description, target_quantity = :targetQuantity, end_date = :endDate, status = :status
            WHERE campaign_id = :campaignId";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':targetQuantity', $targetQuantity, PDO::PARAM_INT);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':endDate', $endDate);
    $stmt->bindParam(':campaignId', $campaignId, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Campaign updated successfully."
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>