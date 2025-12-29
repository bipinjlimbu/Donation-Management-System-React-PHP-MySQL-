<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data['user_id'] ?? 0);
$message = trim($data['message'] ?? '');
$rating = intval($data['rating'] ?? 0);

$status = "Pending";
$created_at = date("Y-m-d H:i:s");

if (empty($user_id) || empty($message) || $rating <= 0 || $rating > 5) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required and rating must be between 1 and 5."
    ]);
    exit;
}

try {
    $sql = "INSERT INTO testimonials(user_id, message, rating, status, created_at)
            VALUES(:user_id, :message, :rating, :status, :created_at)";

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
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>