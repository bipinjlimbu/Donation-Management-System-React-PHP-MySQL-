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

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'NGO') {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$conn = (new connectDB())->connect();
$data = json_decode(file_get_contents("php://input"), true);

$title = trim($data['title'] ?? '');
$description = trim($data['description'] ?? '');
$item_name = trim($data['item_name'] ?? '');
$unit = trim($data['unit'] ?? '');
$target_quantity = intval($data['target_quantity'] ?? 0);
$start_date = trim($data['start_date'] ?? '');
$end_date = trim($data['end_date'] ?? '');
$ngo_id = $_SESSION['user_id'];

$status = "Pending";
$requested_at = date("Y-m-d H:i:s");

if (
    empty($title) || empty($description) || empty($item_name) ||
    empty($unit) || $target_quantity <= 0 || empty($start_date) ||
    empty($end_date)
) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

try {
    $sql = "INSERT INTO campaigns(ngo_id, title, description, item_name, target_quantity, collected_quantity, unit, status, start_date, end_date, requested_at)
            VALUES(:ngo_id, :title, :description, :item_name, :target_quantity, 0, :unit, :status, :start_date, :end_date, :requested_at)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':ngo_id', $ngo_id, PDO::PARAM_INT);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':item_name', $item_name);
    $stmt->bindParam(':target_quantity', $target_quantity, PDO::PARAM_INT);
    $stmt->bindParam(':unit', $unit);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':start_date', $start_date);
    $stmt->bindParam(':end_date', $end_date);
    $stmt->bindParam(':requested_at', $requested_at);

    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Campaign request submitted successfully. Pending admin approval."
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
