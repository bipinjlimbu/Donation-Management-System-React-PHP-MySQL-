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
$role = $data['role'] ?? '';

if (!$userId || !$role) {
    echo json_encode(["success" => false, "message" => "Missing required data."]);
    exit;
}

try {
    if ($role === "Donor") {
        $sql = "UPDATE donor SET pending_full_name = NULL, pending_phone = NULL, pending_address = NULL, pending_status = 'Denied', approved_at = NOW() WHERE donor_id = :id";
    } elseif ($role === "NGO") {
        $sql = "UPDATE ngo SET pending_organization_name = NULL, pending_phone = NULL, pending_address = NULL, pending_status = 'Denied', approved_at = NOW() WHERE ngo_id = :id";
    } else {
        echo json_encode(["success" => false, "message" => "Invalid role"]);
        exit;
    }

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":id", $userId, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "User request denied successfully."]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>