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

require_once 'session.php';
require_once 'connectDB.php';

if (!isset($_SESSION['user_id'], $_SESSION['role'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$conn = (new connectDB())->connect();

try {
    $conn->exec("
        UPDATE campaigns 
        SET status = 'Active', approved_at = NOW()
        WHERE status = 'Approved' AND start_date <= CURDATE()
    ");

    $conn->exec("
        UPDATE campaigns 
        SET status = 'Completed'
        WHERE status = 'Active'
        AND (end_date < CURDATE() OR collected_quantity >= target_quantity)
    ");

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
        ORDER BY c.requested_at DESC
    ");
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "campaigns" => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error"]);
}
