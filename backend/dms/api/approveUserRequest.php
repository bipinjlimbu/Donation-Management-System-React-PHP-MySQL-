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
        $sql = "UPDATE donor SET full_name = pending_full_name, phone = pending_phone, address = pending_address, pending_full_name = NULL, pending_phone = NULL, pending_address = NULL, pending_status = 'Approved', approved_at = NOW() WHERE donor_id = :id";
    } elseif ($role === "NGO") {
        $sql = "UPDATE ngo SET organization_name = pending_organization_name, phone = pending_phone, address = pending_address, pending_organization_name = NULL, pending_phone = NULL, pending_address = NULL, pending_status = 'Approved', approved_at = NOW() WHERE ngo_id = :id";
    } else {
        echo json_encode(["success" => false, "message" => "Invalid role"]);
        exit;
    }

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":id", $userId, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "User profile approved successfully."]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>