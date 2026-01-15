<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (!isset($_SESSION['user_id']) || ($_SESSION['role'] ?? '') !== 'Admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);
$register_id = $data['register_id'] ?? null;

if (!$register_id) {
    echo json_encode(["success" => false, "message" => "Missing register_id"]);
    exit;
}

try {
    $sql = "SELECT * FROM register WHERE register_id = :id AND status = 'Pending'";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $register_id);
    $stmt->execute();
    $reg = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$reg) {
        echo json_encode(["success" => false, "message" => "Registration request not found or not pending"]);
        exit;
    }

    $sql = "INSERT INTO users (email, password_hash, role) VALUES (:email, :password_hash, :role)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':email', $reg['email']);
    $stmt->bindParam(':password_hash', $reg['password_hash']);
    $stmt->bindParam(':role', $reg['role']);
    $stmt->execute();

    $user_id = $conn->lastInsertId();

    $sql = "UPDATE register SET status = 'Approved', approved_at = NOW(), user_id = :user_id WHERE register_id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':id', $register_id);
    $stmt->execute();

    if ($reg['role'] === 'Donor') {
        $sql = "INSERT INTO donor (donor_id, full_name, phone, address, pending_status, requested_at, approved_at)
                VALUES (:id, :full_name, :phone, :address, 'Approved', :requested_at, NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $user_id);
        $stmt->bindParam(':full_name', $reg['name']);
        $stmt->bindParam(':phone', $reg['phone']);
        $stmt->bindParam(':address', $reg['address']);
        $stmt->bindParam(':requested_at', $reg['requested_at']);
        $stmt->execute();
    }

    if ($reg['role'] === 'NGO') {
        $sql = "INSERT INTO ngo (ngo_id, organization_name, registration_number, phone, address, pending_status, requested_at, approved_at)
                VALUES (:id, :org_name, :reg_no, :phone, :address, 'Approved', :requested_at, NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $user_id);
        $stmt->bindParam(':org_name', $reg['name']);
        $stmt->bindParam(':reg_no', $reg['registration_number']);
        $stmt->bindParam(':phone', $reg['phone']);
        $stmt->bindParam(':address', $reg['address']);
        $stmt->bindParam(':requested_at', $reg['requested_at']);
        $stmt->execute();
    }

    echo json_encode(["success" => true, "message" => "Signup approved successfully", "user_id" => $user_id]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error approving signup", "error" => $e->getMessage()]);
}
?>