<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'session.php';
include 'connectDB.php';

$conn = (new connectDB())->connect();

$campaignId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($campaignId <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid campaign ID"]);
    exit;
}

$conn->prepare("
    UPDATE campaigns 
    SET status = 'Active', approved_at = NOW()
    WHERE status = 'Approved' AND start_date <= CURDATE()
")->execute();

$conn->prepare("
    UPDATE campaigns 
    SET status = 'Completed'
    WHERE status = 'Active'
    AND (end_date < CURDATE() OR collected_quantity >= target_quantity)
")->execute();

$stmt = $conn->prepare("
    SELECT 
        c.campaign_id,
        c.ngo_id,
        c.title,
        c.description,
        c.item_name,
        c.target_quantity,
        c.collected_quantity,
        c.unit,
        c.status,
        c.start_date,
        c.end_date,
        n.organization_name AS ngo_name
    FROM campaigns c
    JOIN ngo n ON c.ngo_id = n.ngo_id
    WHERE c.campaign_id = :id
");
$stmt->bindParam(':id', $campaignId, PDO::PARAM_INT);
$stmt->execute();

$campaign = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$campaign) {
    echo json_encode(["success" => false, "message" => "Campaign not found"]);
    exit;
}

$userId = $_SESSION['user_id'] ?? null;
$role = $_SESSION['role'] ?? null;

$isOwner = ($role === 'NGO' && $userId == $campaign['ngo_id']);
$isAdmin = ($role === 'Admin');

if (!$isOwner && !$isAdmin && !in_array($campaign['status'], ['Active', 'Completed'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access"]);
    exit;
}

echo json_encode([
    "success" => true,
    "campaign" => $campaign
]);