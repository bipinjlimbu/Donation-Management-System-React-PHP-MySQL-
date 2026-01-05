<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized. Please login."
    ]);
    exit;
}

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($_SESSION['user_id']);
$message = trim($data['message'] ?? '');
$rating = intval($data['rating'] ?? 0);

$status = "Pending";
$created_at = date("Y-m-d H:i:s");

if (empty($message) || $rating < 1 || $rating > 5) {
    echo json_encode([
        "success" => false,
        "message" => "Message is required and rating must be between 1 and 5."
    ]);
    exit;
}

try {
    $sql = "INSERT INTO testimonials 
            (user_id, message, rating, status, created_at)
            VALUES (:user_id, :message, :rating, :status, :created_at)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindParam(':message', $message);
    $stmt->bindParam(':rating', $rating, PDO::PARAM_INT);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':created_at', $created_at);

    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Testimonial submitted successfully. Pending admin approval."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
}
