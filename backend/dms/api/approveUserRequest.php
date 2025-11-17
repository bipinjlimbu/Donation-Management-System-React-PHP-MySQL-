<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);
$userId = intval($data['user_id'] ?? 0);
$newUsername = trim($data['new_username'] ?? '');
$newRole = $data['new_role'] ?? '';

if (!$userId || !$newUsername || !$newRole) {
    echo json_encode(["success" => false, "message" => "Missing required data."]);
    exit;
}

try {
    $update = $conn->prepare("UPDATE users SET username = :username, role = :role, pending_username = NULL, pending_role = NULL, pending_status = 'Approved', approved_at = NOW() 
                              WHERE user_id = :id");
    $update->bindParam(":username", $newUsername);
    $update->bindParam(":role", $newRole);
    $update->bindParam(":id", $userId);
    $update->execute();

    echo json_encode(["success" => true, "message" => "User profile updated and approved."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>