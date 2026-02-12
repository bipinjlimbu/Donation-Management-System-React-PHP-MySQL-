<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'], $_SESSION['role'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

include 'connectDB.php';
$conn = (new connectDB())->connect();

$id = intval($_GET['id'] ?? 0);
$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];

try {
    if ($role === "Admin") {
        $stmt = $conn->prepare(
            "SELECT testimonial_id, user_id, message, rating
             FROM testimonials
             WHERE testimonial_id = :id"
        );
        $stmt->execute([":id" => $id]);
    } else {
        $stmt = $conn->prepare(
            "SELECT testimonial_id, user_id, message, rating
             FROM testimonials
             WHERE testimonial_id = :id AND user_id = :user_id"
        );
        $stmt->execute([
            ":id" => $id,
            ":user_id" => $user_id
        ]);
    }

    $testimonial = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$testimonial) {
        echo json_encode(["success" => false, "message" => "Not allowed"]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "testimonial" => $testimonial
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error"]);
}
