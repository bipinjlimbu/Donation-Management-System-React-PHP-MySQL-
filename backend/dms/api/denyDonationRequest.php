<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$conn = (new connectDB())->connect();

$data = json_decode(file_get_contents("php://input"), true);
$donation_id = (int) ($data['donation_id'] ?? 0);

if (!$donation_id) {
    echo json_encode([
        "success" => false,
        "message" => "Donation ID is required."
    ]);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE donations SET status='Denied' WHERE donation_id=:donation_id AND status='Pending'");
    $stmt->bindParam(':donation_id', $donation_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Donation denied successfully."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No matching pending donation found."
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>