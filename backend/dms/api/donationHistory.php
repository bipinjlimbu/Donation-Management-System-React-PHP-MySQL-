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
$campaignName = trim($data['campaign_name'] ?? '');
$name = trim($data['item_type'] ?? '');
$quantity = (int) ($data['quantity'] ?? 0);
$ngo = strtolower(trim($data['ngo'] ?? ''));
$donor = strtolower(trim($data['donor'] ?? ''));

if (!$donationId || !$campaignName || !$name || !$ngo || !$donor || $quantity <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required, including donation_id and valid quantity."
    ]);
    exit;
}

try {
    $insert = "INSERT INTO donationhistory (campaign_name, item_type, item_quantity, ngo, donor)
               VALUES (:campaign_name, :name, :quantity, :ngo, :donor)";
    $stmt = $conn->prepare($insert);
    $stmt->bindParam(':campaign_name', $campaignName, PDO::PARAM_STR);
    $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
    $stmt->bindParam(':ngo', $ngo, PDO::PARAM_STR);
    $stmt->bindParam(':donor', $donor, PDO::PARAM_STR);
    $stmt->execute();

    $update = "UPDATE campaigndetails
               SET collected_quantity = collected_quantity + :quantity 
               WHERE campaign_name = :campaign_name";
    $stmt2 = $conn->prepare($update);
    $stmt2->bindParam(':quantity', $quantity, PDO::PARAM_INT);
    $stmt2->bindParam(':campaign_name', $campaignName, PDO::PARAM_STR);
    $stmt2->execute();

    $delete = "DELETE FROM donationpending WHERE donation_id = :donation_id";
    $stmt3 = $conn->prepare($delete);
    $stmt3->bindParam(':donation_id', $donationId, PDO::PARAM_INT);
    $stmt3->execute();

    echo json_encode([
        "success" => true,
        "message" => "Donation approved, campaign updated, and pending request removed."
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>