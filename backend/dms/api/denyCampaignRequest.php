<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

if (!isset($_SESSION['user_id']) || ($_SESSION['role'] ?? '') !== 'Admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$campaignID = intval($data['campaign_id'] ?? 0);

if (!$campaignID) {
    echo json_encode(["success" => false, "message" => "Missing campaign ID."]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT campaign_id, title, ngo_id FROM campaigns WHERE campaign_id = :id AND status = 'Pending'");
    $stmt->bindParam(":id", $campaignID);
    $stmt->execute();
    $campaign = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$campaign) {
        echo json_encode(["success" => false, "message" => "Campaign not found or already processed."]);
        exit;
    }

    $update = $conn->prepare("UPDATE campaigns SET status = 'Denied' WHERE campaign_id = :id");
    $update->bindParam(":id", $campaignID);
    $update->execute();

    $notify = $conn->prepare("INSERT INTO notifications (user_id, title, message, status, created_at) VALUES (:user_id, :title, :message, 'unread', NOW())");
    $title = "Campaign Denied";
    $message = "Your campaign \"{$campaign['title']}\" was denied by the admin.";
    $notify->bindParam(":user_id", $campaign['ngo_id']);
    $notify->bindParam(":title", $title);
    $notify->bindParam(":message", $message);
    $notify->execute();

    echo json_encode(["success" => true, "message" => "Campaign denied and notification sent."]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error", "error" => $e->getMessage()]);
}
?>