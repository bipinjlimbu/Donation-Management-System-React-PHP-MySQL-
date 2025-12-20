<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'connectDB.php';

try {
    $conn = (new connectDB())->connect();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = intval($data['user_id'] ?? 0);

    if (!$user_id) {
        echo json_encode(["success" => false, "message" => "Missing user_id"]);
        exit;
    }

    $sql = "SELECT notification_id, title, message, status, created_at 
            FROM notifications 
            WHERE user_id = :user_id 
            ORDER BY created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "notifications" => $notifications
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Unexpected error",
        "error" => $e->getMessage()
    ]);
}
?>