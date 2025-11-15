<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);
$pending_id = intval($data['pending_id'] ?? 0);
$newUsername = $data['new_username'] ?? '';
$newRole = $data['new_role'] ?? '';
$userId = intval($data['user_id'] ?? 0);

if (!$pending_id || !$userId || !$newUsername || !$newRole) {
    echo json_encode(["success" => false, "message" => "Missing required data."]);
    exit;
}

try {
    $update = $conn->prepare("UPDATE userdetails SET username = :username, role = :role WHERE user_id = :id");
    $update->bindParam(":username", $newUsername);
    $update->bindParam(":role", $newRole);
    $update->bindParam(":id", $userId);
    $update->execute();

    $delete = $conn->prepare("DELETE FROM userpending WHERE pending_id = :pending_id");
    $delete->bindParam(":pending_id", $pending_id);
    $delete->execute();

    echo json_encode(["success" => true, "message" => "User profile updated and approved."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>