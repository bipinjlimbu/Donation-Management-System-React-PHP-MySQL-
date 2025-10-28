<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data['campaign_name'] ?? '');
$description = trim($data['campaign_description'] ?? '');
$itemType = trim($data['item_type'] ?? '');
$category = trim($data['campaign_category'] ?? '');
$targetedQty = (int) ($data['targeted_quantity'] ?? 0);
$location = trim($data['location'] ?? '');
$endDate = trim($data['end_date'] ?? '');
$createdBy = trim($data['created_by'] ?? '');
$status = "Active";
$startDate = date("Y-m-d");
$collectedQty = 0;

if (!$name || !$description || !$itemType || !$category || !$targetedQty || !$location || !$endDate || !$createdBy) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

try {
    $sql = "INSERT INTO campaigndetails 
            (campaign_name, campaign_description, item_type, campaign_category, target_quantity, collected_quantity, location, start_date, end_date, campaign_status, created_by)
            VALUES (:name, :description, :itemType, :category, :targetQty, :collectedQty, :location, :startDate, :endDate, :status, :createdBy)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':itemType', $itemType);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':targetQty', $targetedQty, PDO::PARAM_INT);
    $stmt->bindParam(':collectedQty', $collectedQty, PDO::PARAM_INT);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':startDate', $startDate);
    $stmt->bindParam(':endDate', $endDate);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':createdBy', $createdBy, PDO::PARAM_STR);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Campaign created successfully."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>