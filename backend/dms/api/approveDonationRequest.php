<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$pending_id = (int) ($data['pending_id'] ?? 0);
$campaign_id = (int) ($data['campaign_id'] ?? 0);
$quantity = (int) ($data['quantity'] ?? 0);
$donor_id = (int) ($data['donor_id'] ?? 0);

if (!$pending_id || !$campaign_id || !$donor_id || $quantity <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required and quantity must be greater than zero."
    ]);
    exit;
}

try {
    $insert = "INSERT INTO donationhistory (campaign_id, donor_id, quantity, donated_at)
               VALUES (:campaign_id, :donor_id, :quantity, NOW())";
    $stmt = $conn->prepare($insert);
    $stmt->bindParam(':campaign_id', $campaign_id, PDO::PARAM_INT);
    $stmt->bindParam(':donor_id', $donor_id, PDO::PARAM_INT);
    $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
    $stmt->execute();

    $update = "UPDATE campaigndetails SET collected_quantity = collected_quantity + :quantity 
                       WHERE campaign_id = :campaign_id";
    $stmt2 = $conn->prepare($update);
    $stmt2->bindParam(':quantity', $quantity, PDO::PARAM_INT);
    $stmt2->bindParam(':campaign_id', $campaign_id, PDO::PARAM_INT);
    $stmt2->execute();

    $delete = "DELETE FROM donationpending WHERE pending_id = :pending_id";
    $stmt3 = $conn->prepare($delete);
    $stmt3->bindParam(':pending_id', $pending_id, PDO::PARAM_INT);
    $stmt3->execute();

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