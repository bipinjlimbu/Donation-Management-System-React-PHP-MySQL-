<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);
$campaignId = isset($_GET['id']) ? (int)$_GET['id']: 0;  
if ($campaignId <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid campaign ID"
    ]);
    exit;
}
$stmt = $conn->prepare("SELECT * FROM campaigndetails WHERE campaign_id = :id");
$stmt->bindParam(':id', $campaignId, PDO::PARAM_INT);
$stmt->execute();
$campaign = $stmt->fetch(PDO::FETCH_ASSOC);
if ($campaign) {
    echo json_encode([
        "success" => true,
        "campaign" => $campaign
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Campaign not found"
    ]);
}
?>
