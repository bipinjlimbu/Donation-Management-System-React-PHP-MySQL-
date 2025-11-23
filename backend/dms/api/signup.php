<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$email = strtolower(trim($data['email'] ?? ''));
$password = trim($data['password'] ?? '');
$role = $data['role'] ?? 'Donor';
$registration_number = trim($data['registration_number'] ?? null);
$requested_at = date('Y-m-d H:i:s');

if (!$email || !$password) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);
    exit;
}

$sql = "SELECT * FROM register WHERE email = :email";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':email', $email);
$stmt->execute();
$existing = $stmt->fetch(PDO::FETCH_ASSOC);

if ($existing) {
    echo json_encode([
        "success" => false,
        "message" => "Email already exists"
    ]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);
$sql = "INSERT INTO register (email, password_hash, role, registration_number, status, requested_at)
        VALUES (:email, :password_hash, :role, :registration_number, 'Pending', :requested_at)";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password_hash', $hashedPassword);
$stmt->bindParam(':role', $role);
$stmt->bindParam(':registration_number', $registration_number);
$stmt->bindParam(':requested_at', $requested_at);
$stmt->execute();

echo json_encode([
    "success" => true,
    "message" => "Signup request submitted! Waiting for admin approval."
]);
?>