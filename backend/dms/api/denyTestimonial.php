<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

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
        SET status = 'Denied'
        WHERE testimonial_id = :id
    ");
    $update->bindParam(":id", $testimonialID);
    $update->execute();

    $notify = $conn->prepare("
        INSERT INTO notifications (user_id, title, message, status, created_at)
        VALUES (:user_id, :title, :message, 'unread', NOW())
    ");

    $title = "Testimonial Rejected";
    $message = "Your testimonial was reviewed but was not approved.";

    $notify->bindParam(":user_id", $testimonial['user_id']);
    $notify->bindParam(":title", $title);
    $notify->bindParam(":message", $message);
    $notify->execute();

    echo json_encode([
        "success" => true,
        "message" => "Testimonial denied successfully."
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
?>