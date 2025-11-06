<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data['user_id'] ?? 0);
$new_username = trim($data['new_username'] ?? '');
$new_role = trim($data['new_role'] ?? '');
$requested_at = date("Y-m-d H:i:s");

if (!$user_id || !$new_username || !$new_role) {
    echo json_encode([
        "success" => false,
        "message" => "User ID, new username, and new role are required"
    ]);
    exit;
}

try {
    $sql = "INSERT INTO userpending
            (user_id, new_username, new_role, status, requested_at)
            VALUES (:user_id, :new_username, :new_role, 'Pending', :requested_at)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':new_username', $new_username);
    $stmt->bindParam(':new_role', $new_role);
    $stmt->bindParam(':requested_at', $requested_at);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Profile change requested successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No record requested. Check user ID or no changes made."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>