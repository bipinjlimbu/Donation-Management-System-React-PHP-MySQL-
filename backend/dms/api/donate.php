<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$donor_id = (int) ($data['donor_id'] ?? 0);
$campaign_id = (int) ($data['campaign_id'] ?? 0);
$quantity = (float) ($data['quantity'] ?? 0);

if (!$donor_id || !$campaign_id || $quantity <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required and quantity must be greater than zero"
    ]);
    exit;
}

try {
    $ngoQuery = "SELECT ngo_id FROM campaigns WHERE campaign_id = :campaign_id";
    $ngoStmt = $conn->prepare($ngoQuery);
    $ngoStmt->bindParam(':campaign_id', $campaign_id, PDO::PARAM_INT);
    $ngoStmt->execute();
    $ngoResult = $ngoStmt->fetch(PDO::FETCH_ASSOC);

    if (!$ngoResult) {
        echo json_encode(["success" => false, "message" => "Campaign not found"]);
        exit;
    }

    $ngo_id = $ngoResult['ngo_id'];

    $sql = "INSERT INTO donations (donor_id, campaign_id, quantity, status)
            VALUES (:donor_id, :campaign_id, :quantity, 'Pending')";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':donor_id', $donor_id, PDO::PARAM_INT);
    $stmt->bindParam(':campaign_id', $campaign_id, PDO::PARAM_INT);
    $stmt->bindParam(':quantity', $quantity, PDO::PARAM_STR);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Donation request submitted successfully!"]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>