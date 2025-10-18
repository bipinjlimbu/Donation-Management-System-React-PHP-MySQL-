<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);
$campaignId = (int)($data['campaign_id'] ?? 0);
$name = trim($data['campaign_name'] ?? '');
$description = trim($data['campaign_description'] ?? '');
$status = trim($data['campaign_status'] ?? '');
$startDate = trim($data['start_date'] ?? '');
$endDate = trim($data['end_date'] ?? '');
if ($campaignId <= 0 || !$name || !$description || !$status || !$startDate || !$endDate) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required and campaign ID must be valid"
    ]);
    exit;
}

try {
    $sql = "UPDATE campaigndetails SET campaign_name = :name, campaign_description = :description, campaign_status = :status, start_date = :startDate, end_date = :endDate WHERE campaign_id = :campaignId";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':startDate', $startDate);
    $stmt->bindParam(':endDate', $endDate);
    $stmt->bindParam(':campaignId', $campaignId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Campaign updated successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No record updated. Check campaign ID or no changes made."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
