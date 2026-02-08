<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

include 'session.php';
include 'connectDB.php';

if (($_SESSION['role'] ?? '') !== 'Admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$registerId = intval($data['register_id'] ?? 0);
$userId = !empty($data['user_id']) ? intval($data['user_id']) : null;

if ($registerId <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid ID"]);
    exit;
}

try {
    $conn = (new connectDB())->connect();

    $delReg = $conn->prepare("DELETE FROM register WHERE register_id = :rid");
    $delReg->bindParam(':rid', $registerId, PDO::PARAM_INT);
    $delReg->execute();

    if ($userId && $userId != $_SESSION['user_id']) {
        $delUser = $conn->prepare("DELETE FROM users WHERE user_id = :uid");
        $delUser->bindParam(':uid', $userId, PDO::PARAM_INT);
        $delUser->execute();
    }

    echo json_encode(["success" => true, "message" => "Specific record deleted"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error"]);
}
?>