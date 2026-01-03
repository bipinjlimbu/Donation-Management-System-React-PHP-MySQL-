<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

include 'connectDB.php';

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$address = trim($data['address'] ?? '');
$role = $data['role'] ?? '';
$user_id = $_SESSION['user_id'];
$requested_at = date("Y-m-d H:i:s");

if (!$name || !$role) {
    echo json_encode([
        "success" => false,
        "message" => "Name and role are required"
    ]);
    exit;
}

try {
    $conn = (new connectDB())->connect();

    if ($role === "Donor") {
        $sql = "UPDATE donor
                SET pending_full_name = :name,
                    pending_phone = :phone,
                    pending_address = :address,
                    pending_status = 'Pending',
                    requested_at = :requested_at
                WHERE donor_id = :user_id";
    } elseif ($role === "NGO") {
        $sql = "UPDATE ngo
                SET pending_organization_name = :name,
                    pending_phone = :phone,
                    pending_address = :address,
                    pending_status = 'Pending',
                    requested_at = :requested_at
                WHERE ngo_id = :user_id";
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Invalid role"
        ]);
        exit;
    }

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':requested_at', $requested_at);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Profile change requested successfully"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
