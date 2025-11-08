<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$title = trim($data['title'] ?? '');
$description = trim($data['description'] ?? '');
$itemType = trim($data['item_type'] ?? '');
$category = trim($data['category'] ?? '');
$targetQuantity = (float) ($data['target_quantity'] ?? 0);
$location = trim($data['location'] ?? '');
$startDate = trim($data['start_date'] ?? '');
$endDate = trim($data['end_date'] ?? '');
$ngoId = intval($data['user_id'] ?? 0);
$status = "Pending";
$requestedAt = date("Y-m-d H:i:s");

if (!$title || !$description || !$itemType || !$category || !$targetQuantity || !$location || !$startDate || !$endDate || !$ngoId) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

try {
    $sql = "INSERT INTO campaignpending 
            (ngo_id, title, description, item_type, category, target_Quantity, location, start_date, end_date, status, requested_at)
            VALUES 
            (:ngoId, :title, :description, :itemType, :category, :targetQuantity, :location, :startDate, :endDate, :status, :requestedAt)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':ngoId', $ngoId, PDO::PARAM_INT);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':itemType', $itemType);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':targetQuantity', $targetQuantity);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':startDate', $startDate);
    $stmt->bindParam(':endDate', $endDate);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':requestedAt', $requestedAt);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Campaign creation request submitted successfully and is pending approval."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>