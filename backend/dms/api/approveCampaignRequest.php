<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);
$campaignID = intval($data['campaign_id'] ?? 0);

if (!$campaignID) {
    echo json_encode(["success" => false, "message" => "Missing campaign ID."]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM campaigns WHERE campaign_id = :id AND status = 'Pending'");
    $stmt->bindParam(":id", $campaignID);
    $stmt->execute();
    $campaign = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$campaign) {
        echo json_encode(["success" => false, "message" => "Campaign not found or already processed."]);
        exit;
    }

    $update = $conn->prepare("UPDATE campaigns SET status = 'Approved', approved_at = NOW() WHERE campaign_id = :id");
    $update->bindParam(":id", $campaignID);
    $update->execute();

    echo json_encode(["success" => true, "message" => "Campaign approved and is now Approved."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>