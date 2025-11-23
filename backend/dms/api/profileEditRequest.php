<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data['user_id'] ?? 0);
$role = $data['role'] ?? '';
$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$address = trim($data['address'] ?? '');
$requested_at = date("Y-m-d H:i:s");

if (!$user_id || !$role || !$name) {
    echo json_encode([
        "success" => false,
        "message" => "User ID, role, and name are required"
    ]);
    exit;
}

try {
    if ($role === "Donor") {
        $sql = "UPDATE donor SET pending_full_name = :name, pending_phone = :phone, pending_address = :address, pending_status = 'Pending', requested_at = :requested_at
                WHERE donor_id = :user_id";
    } elseif ($role === "NGO") {
        $sql = "UPDATE ngo SET pending_organization_name = :name, pending_phone = :phone, pending_address = :address, pending_status = 'Pending', requested_at = :requested_at
                WHERE ngo_id = :user_id";
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Invalid role"
        ]);
        exit;
    }

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
    $stmt->bindParam(':address', $address, PDO::PARAM_STR);
    $stmt->bindParam(':requested_at', $requested_at, PDO::PARAM_STR);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Profile change requested successfully"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>