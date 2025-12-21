<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include 'connectDB.php';
$conn = (new connectDB())->connect();

$data = json_decode(file_get_contents("php://input"), true);
$notification_id = intval($data['notification_id'] ?? 0);

if (!$notification_id) {
    echo json_encode([
        "success" => false,
        "message" => "Missing notification ID"
    ]);
    exit;
}

try {
    $stmt = $conn->prepare(
        "UPDATE notifications 
         SET status = 'read' 
         WHERE notification_id = :id"
    );
    $stmt->bindParam(":id", $notification_id, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
?>