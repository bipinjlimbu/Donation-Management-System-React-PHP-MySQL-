<?php
require_once 'session.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["authenticated" => false]);
    exit;
}

require_once 'connectDB.php';
$conn = (new connectDB())->connect();

$stmt = $conn->prepare("SELECT user_id, email, role FROM users WHERE user_id = :id");
$stmt->execute(['id' => $_SESSION['user_id']]);

echo json_encode([
    "authenticated" => true,
    "user" => $stmt->fetch(PDO::FETCH_ASSOC)
]);
