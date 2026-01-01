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

include 'session.php';
include 'connectDB.php';

$conn = (new connectDB())->connect();
$data = json_decode(file_get_contents("php://input"), true);

$email = strtolower(trim($data['email'] ?? ''));
$password = trim($data['password'] ?? '');

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "Email and password required"]);
    exit;
}

$stmt = $conn->prepare(
    "SELECT user_id, email, password_hash, role FROM users WHERE email = :email"
);
$stmt->bindParam(':email', $email);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    exit;
}

$_SESSION['user_id'] = $user['user_id'];
$_SESSION['role'] = $user['role'];

echo json_encode([
    "success" => true,
    "user" => [
        "user_id" => $user['user_id'],
        "email" => $user['email'],
        "role" => $user['role']
    ]
]);
