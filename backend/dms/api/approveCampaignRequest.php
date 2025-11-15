<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);
$campaignID = intval($data['campaign_id'] ?? 0);

if (!$campaignID) {
    echo json_encode(["success" => false, "message" => "Missing campaign ID."]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM campaignpending WHERE pending_id = :id");
    $stmt->bindParam(":id", $campaignID);
    $stmt->execute();
    $campaign = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$campaign) {
        echo json_encode(["success" => false, "message" => "Campaign not found."]);
        exit;
    }

    $insert = $conn->prepare("INSERT INTO campaigndetails (ngo_id, title, description, item_type, category, target_quantity, collected_quantity, location, start_date, end_date, status)
                                    VALUES (:ngoId, :title, :description, :item, :category, :targetQuantity, 0, :location, :startDate, :endDate, 'Active')");
    $insert->bindParam(":ngoId", $campaign['ngo_id']);
    $insert->bindParam(":title", $campaign['title']);
    $insert->bindParam(":description", $campaign['description']);
    $insert->bindParam(":item", $campaign['item_type']);
    $insert->bindParam(":category", $campaign['category']);
    $insert->bindParam(":targetQuantity", $campaign['target_quantity']);
    $insert->bindParam(":location", $campaign['location']);
    $insert->bindParam(":startDate", $campaign['start_date']);
    $insert->bindParam(":endDate", $campaign['end_date']);
    $insert->execute();

    $delete = $conn->prepare("DELETE FROM campaignpending WHERE pending_id = :id");
    $delete->bindParam(":id", $campaignID);
    $delete->execute();

    echo json_encode(["success" => true, "message" => "Campaign approved and moved to active list."]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>