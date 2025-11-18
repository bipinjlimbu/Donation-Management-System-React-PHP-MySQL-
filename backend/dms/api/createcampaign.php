<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$title = trim($data['title'] ?? '');
$description = trim($data['description'] ?? '');
$item_name = trim($data['item_name'] ?? '');
$unit = trim($data['unit'] ?? '');
$target_quantity = (int) ($data['target_quantity'] ?? 0);
$start_date = trim($data['start_date'] ?? '');
$end_date = trim($data['end_date'] ?? '');
$ngo_id = intval($data['ngo_id'] ?? 0);
$status = "Pending";
$requested_at = date("Y-m-d H:i:s");

if (!$title || !$description || !$item_name || !$unit || !$target_quantity || !$start_date || !$end_date || !$ngo_id) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

try {
    $sql = "INSERT INTO Campaigns (ngo_id, title, description, item_name, target_quantity, collected_quantity, unit, status, start_date, end_date, requested_at)
            VALUES (:ngo_id, :title, :description, :item_name, :target_quantity, 0, :unit, :status, :start_date, :end_date, :requested_at)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':ngo_id', $ngo_id, PDO::PARAM_INT);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':item_name', $item_name);
    $stmt->bindParam(':target_quantity', $target_quantity);
    $stmt->bindParam(':unit', $unit);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':start_date', $start_date);
    $stmt->bindParam(':end_date', $end_date);
    $stmt->bindParam(':requested_at', $requested_at);

    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Campaign creation request submitted successfully and is pending approval."
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>