<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);
$donationId = (int) ($data['donation_id'] ?? 0);

if (!$donationId) {
    echo json_encode([
        "success" => false,
        "message" => "Donation ID is required."
    ]);
    exit;
}

try {
    $delete = "DELETE FROM donationpending WHERE donation_id = :donation_id";
    $stmt = $conn->prepare($delete);
    $stmt->bindParam(':donation_id', $donationId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Pending donation removed successfully."
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