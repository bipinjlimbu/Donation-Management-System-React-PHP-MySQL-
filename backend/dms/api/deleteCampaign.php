<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'session.php';
include 'connectDB.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

if ($_SESSION['role'] !== 'NGO' && $_SESSION['role'] !== 'Admin') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Forbidden: You do not have permission"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$campaignId = intval($data['campaign_id'] ?? 0);

if ($campaignId <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid campaign ID"]);
    exit;
}

try {
    $conn = (new connectDB())->connect();

    $stmt = $conn->prepare("SELECT ngo_id FROM campaigns WHERE campaign_id = :id");
    $stmt->bindParam(":id", $campaignId, PDO::PARAM_INT);
    $stmt->execute();
    $campaign = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$campaign) {
        echo json_encode(["success" => false, "message" => "Campaign not found"]);
        exit;
    }

    $isOwner = ($campaign['ngo_id'] == $_SESSION['user_id'] && $_SESSION['role'] === 'NGO');
    $isAdmin = ($_SESSION['role'] === 'Admin');

    if (!$isOwner && !$isAdmin) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "You do not have permission to delete this campaign"]);
        exit;
    }

    $delete = $conn->prepare("DELETE FROM campaigns WHERE campaign_id = :id");
    $delete->bindParam(":id", $campaignId, PDO::PARAM_INT);
    $delete->execute();

    echo json_encode(["success" => true, "message" => "Campaign deleted successfully"]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>