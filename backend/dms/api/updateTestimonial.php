<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
    exit;

if (!isset($_SESSION['user_id'], $_SESSION['role'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

include 'connectDB.php';
$conn = (new connectDB())->connect();

$data = json_decode(file_get_contents("php://input"), true);

$testimonial_id = intval($data['testimonial_id'] ?? 0);
$message = trim($data['message'] ?? '');
$rating = intval($data['rating'] ?? 0);

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];

if ($testimonial_id === 0 || empty($message) || $rating < 1 || $rating > 5) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

try {
    if ($role !== "Admin") {
        $check = $conn->prepare(
            "SELECT testimonial_id FROM testimonials 
             WHERE testimonial_id = :id AND user_id = :user_id"
        );
        $check->execute([
            ":id" => $testimonial_id,
            ":user_id" => $user_id
        ]);

        if ($check->rowCount() === 0) {
            echo json_encode(["success" => false, "message" => "Not allowed"]);
            exit;
        }
    }

    $stmt = $conn->prepare(
        "UPDATE testimonials 
         SET message = :message, rating = :rating
         WHERE testimonial_id = :id"
    );

    $stmt->execute([
        ":message" => $message,
        ":rating" => $rating,
        ":id" => $testimonial_id
    ]);

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error"]);
}
