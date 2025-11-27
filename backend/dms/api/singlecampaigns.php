<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$campaignId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($campaignId <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid campaign ID"]);
    exit;
}

try {
    $activate = $conn->prepare("UPDATE campaigns SET status = 'Active', approved_at = NOW()
        WHERE status = 'Approved' AND start_date <= CURDATE()");
    $activate->execute();

    $complete = $conn->prepare("UPDATE campaigns SET status = 'Completed'
        WHERE status = 'Active' AND (end_date < CURDATE() OR collected_quantity >= target_quantity)");
    $complete->execute();

    $stmt = $conn->prepare("SELECT c.campaign_id, c.ngo_id, c.title, c.description, c.item_name, c.target_quantity, c.collected_quantity, c.unit, c.status, c.start_date, c.end_date, u.organization_name AS ngo_name
        FROM campaigns c JOIN ngo u ON c.ngo_id = u.ngo_id WHERE c.campaign_id = :id");
    $stmt->bindParam(':id', $campaignId, PDO::PARAM_INT);
    $stmt->execute();

    $campaign = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($campaign) {
        echo json_encode(["success" => true, "campaign" => $campaign]);
    } else {
        echo json_encode(["success" => false, "message" => "Campaign not found"]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>