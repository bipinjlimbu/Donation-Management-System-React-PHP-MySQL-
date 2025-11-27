<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$conn = (new connectDB())->connect();

$data = json_decode(file_get_contents("php://input"), true);

$donation_id = (int) ($data['donation_id'] ?? 0);
$campaign_id = (int) ($data['campaign_id'] ?? 0);
$quantity = (int) ($data['quantity'] ?? 0);

if (!$donation_id || !$campaign_id || $quantity <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required and quantity must be greater than zero."
    ]);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE donations SET status='Approved', delivered_at=NOW() WHERE donation_id=:donation_id AND status='Pending'");
    $stmt->bindParam(':donation_id', $donation_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        echo json_encode(["success" => false, "message" => "Donation not found or already processed."]);
        exit;
    }

    $stmt2 = $conn->prepare("UPDATE campaigns SET collected_quantity = collected_quantity + :quantity WHERE campaign_id=:campaign_id");
    $stmt2->bindParam(':quantity', $quantity, PDO::PARAM_INT);
    $stmt2->bindParam(':campaign_id', $campaign_id, PDO::PARAM_INT);
    $stmt2->execute();

    echo json_encode([
        "success" => true,
        "message" => "Donation approved successfully."
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>