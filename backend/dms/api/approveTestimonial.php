<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

if (!isset($_SESSION['user_id']) || ($_SESSION['role'] ?? '') !== 'Admin') {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$testimonialID = intval($data['testimonial_id'] ?? 0);

if (!$testimonialID) {
    echo json_encode([
        "success" => false,
        "message" => "Missing testimonial ID."
    ]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT testimonial_id, user_id 
        FROM testimonials 
        WHERE testimonial_id = :id AND status = 'Pending'
    ");
    $stmt->bindParam(":id", $testimonialID);
    $stmt->execute();
    $testimonial = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$testimonial) {
        echo json_encode([
            "success" => false,
            "message" => "Testimonial not found or already processed."
        ]);
        exit;
    }

    $update = $conn->prepare("
        UPDATE testimonials 
        SET status = 'Approved', approved_at = NOW() 
        WHERE testimonial_id = :id
    ");
    $update->bindParam(":id", $testimonialID);
    $update->execute();

    $notify = $conn->prepare("
        INSERT INTO notifications (user_id, title, message, status, created_at)
        VALUES (:user_id, :title, :message, 'unread', NOW())
    ");

    $title = "Testimonial Approved";
    $message = "Your testimonial has been approved and is now visible.";

    $notify->bindParam(":user_id", $testimonial['user_id']);
    $notify->bindParam(":title", $title);
    $notify->bindParam(":message", $message);
    $notify->execute();

    echo json_encode([
        "success" => true,
        "message" => "Testimonial approved successfully."
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
