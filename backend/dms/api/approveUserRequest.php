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
    $updateUser = $conn->prepare("UPDATE userdetails SET username = :username, role = :role WHERE user_id = :id");
    $updateUser->bindParam(":username", $newUsername);
    $updateUser->bindParam(":role", $newRole);
    $updateUser->bindParam(":id", $userId);
    $updateUser->execute();

    $updateReq = $conn->prepare("UPDATE userpending SET status = 'Approved' WHERE pending_id = :pending_id");
    $updateReq->bindParam(":pending_id", $pending_id);
    $updateReq->execute();

    echo json_encode(["success" => true, "message" => "User profile updated and approved."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>