<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$campaignId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($campaignId <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid campaign ID"]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT c.*, u.username AS ngo_name
        FROM campaigndetails c
        JOIN userdetails u ON c.ngo_id = u.user_id
        WHERE c.campaign_id = :id
    ");
    $stmt->bindParam(':id', $campaignId, PDO::PARAM_INT);
    $stmt->execute();

    $campaign = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($campaign) {
        echo json_encode(["success" => true, "campaign" => $campaign]);
    } else {
        echo json_encode(["success" => false, "message" => "Campaign not found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>