<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

include 'connectDB.php';
$conn = (new connectDB())->connect();

$data = json_decode(file_get_contents("php://input"), true);
$notification_id = (int) ($data['notification_id'] ?? 0);
$user_id = (int) $_SESSION['user_id'];

if (!$notification_id) {
    echo json_encode([
        "success" => false,
        "message" => "Missing notification ID"
    ]);
    exit;
}

try {
    // 🔐 Ensure notification belongs to logged-in user
    $stmt = $conn->prepare(
        "UPDATE notifications
         SET status = 'read'
         WHERE notification_id = :nid
         AND user_id = :uid"
    );
    $stmt->bindParam(':nid', $notification_id, PDO::PARAM_INT);
    $stmt->bindParam(':uid', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Notification not found or unauthorized"
        ]);
        exit;
    }

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
}
