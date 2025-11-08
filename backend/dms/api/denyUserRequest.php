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

if (!$pending_id) {
    echo json_encode(["success" => false, "message" => "Missing request ID."]);
    exit;
}

try {
    $updateReq = $conn->prepare("UPDATE userpending SET status = 'Denied' WHERE pending_id = :pending_id");
    $updateReq->bindParam(":pending_id", $pending_id);
    $updateReq->execute();

    echo json_encode(["success" => true, "message" => "User request denied."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>