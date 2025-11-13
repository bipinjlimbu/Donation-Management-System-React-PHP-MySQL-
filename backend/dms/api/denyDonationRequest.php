<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);
$pendingId = (int) ($data['pending_id'] ?? 0);

if (!$pendingId) {
    echo json_encode([
        "success" => false,
        "message" => "Pending ID is required."
    ]);
    exit;
}

try {
    $update = "UPDATE donationpending SET status = 'Denied' 
               WHERE pending_id = :pending_id";
    $stmt = $conn->prepare($update);
    $stmt->bindParam(':pending_id', $pendingId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Donation request denied successfully."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No matching donation found."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>