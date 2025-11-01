<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$campaignId = (int) ($data['campaign_id'] ?? 0);
$name = trim($data['item_type'] ?? '');
$quantity = (int) ($data['quantity'] ?? 0);
$donatedTo = strtolower(trim($data['donated_to'] ?? ''));
$donatedBy = strtolower(trim($data['donated_by'] ?? ''));

if ($campaignId <= 0 || !$name || !$donatedTo || !$donatedBy || $quantity <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required and campaign ID must be valid"
    ]);
    exit;
}

try {
    $sql = "INSERT INTO donationpending (campaign_id, item_type, donated_quantity, donated_to, donated_by) VALUES (:id, :name, :quantity, :donated_to, :donated_by)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $campaignId, PDO::PARAM_INT);
    $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
    $stmt->bindParam(':donated_to', $donatedTo, PDO::PARAM_STR);
    $stmt->bindParam(':donated_by', $donatedBy, PDO::PARAM_STR);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Donation added for pending successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No request added."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>