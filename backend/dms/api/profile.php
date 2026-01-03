<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'session.php';
include 'connectDB.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$user_id = $_SESSION['user_id']; // Fetch current logged-in user

$conn = (new connectDB())->connect();

try {
    $stmt = $conn->prepare("SELECT user_id, email, role FROM users WHERE user_id = :user_id");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit;
    }

    if ($user['role'] === 'Donor') {
        $stmt = $conn->prepare("SELECT full_name, phone, address FROM donor WHERE donor_id = :id");
        $stmt->bindParam(':id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        $details = $stmt->fetch(PDO::FETCH_ASSOC);
        $user = array_merge($user, $details ?: []);
    } elseif ($user['role'] === 'NGO') {
        $stmt = $conn->prepare("SELECT organization_name, registration_number, phone, address FROM ngo WHERE ngo_id = :id");
        $stmt->bindParam(':id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        $details = $stmt->fetch(PDO::FETCH_ASSOC);
        $user = array_merge($user, $details ?: []);
    }

    echo json_encode([
        "success" => true,
        "user" => $user
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>