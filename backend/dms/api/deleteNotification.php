<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include 'connectDB.php';
$conn = (new connectDB())->connect();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$notification_id = (int) ($data['notification_id'] ?? 0);
$user_id = (int) $_SESSION['user_id'];

if (!$notification_id) {
    echo json_encode(["success" => false, "message" => "Notification ID required"]);
    exit;
}

try {
    $stmt = $conn->prepare("
        DELETE FROM notifications
        WHERE notification_id = :id AND user_id = :user_id
    ");
    $stmt->bindParam(':id', $notification_id, PDO::PARAM_INT);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
}
