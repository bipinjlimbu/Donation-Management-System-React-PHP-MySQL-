<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$email = strtolower(trim($data['email'] ?? ''));
$password = trim($data['password'] ?? '');
$pendingRole = $data['role'] ?? 'Donor';
$requestedAt = date('Y-m-d H:i:s');

if (!$username || !$email || !$password) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);
    exit;
}

$sql = "SELECT * FROM Users WHERE email = :email";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':email', $email);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo json_encode([
        "success" => false,
        "message" => "Email already exists"
    ]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$sql = "INSERT INTO Users (email, password_hash, pending_username, pending_role, requested_at) 
        VALUES (:email, :password_hash, :pending_username, :pending_role, :requested_at)";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password_hash', $hashedPassword);
$stmt->bindParam(':pending_username', $username);
$stmt->bindParam(':pending_role', $pendingRole);
$stmt->bindParam(':requested_at', $requestedAt);
$stmt->execute();

$user_id = $conn->lastInsertId();

$sqlDonor = "INSERT INTO Donor (donor_id) VALUES (:donor_id)";
$stmtDonor = $conn->prepare($sqlDonor);
$stmtDonor->bindParam(':donor_id', $user_id);
$stmtDonor->execute();

echo json_encode([
    "success" => true,
    "message" => "Signup Successfull!"
]);
?>