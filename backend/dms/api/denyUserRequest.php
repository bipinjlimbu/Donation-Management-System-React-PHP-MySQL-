<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);
$userId = intval($data['user_id'] ?? 0);

if (!$userId) {
    echo json_encode(["success" => false, "message" => "Missing user ID."]);
    exit;
}

try {
    $update = $conn->prepare("UPDATE users SET pending_status = 'Denied', pending_username = NULL, pending_role = NULL, approved_at = NOW()
                              WHERE user_id = :id");
    $update->bindParam(":id", $userId);
    $update->execute();

    echo json_encode(["success" => true, "message" => "User request denied."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>