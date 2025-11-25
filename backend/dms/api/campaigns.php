<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$role = $_GET['role'] ?? null;
$user_id = $_GET['user_id'] ?? null;

try {
    $update = $conn->prepare("UPDATE campaigns SET status = 'Completed' WHERE status = 'Active'
                                    AND (end_date < CURDATE() OR collected_quantity >= target_quantity)");
    $update->execute();

    $stmt = $conn->prepare("SELECT campaign_id, ngo_id, title, description, item_name, target_quantity, collected_quantity, unit, status, start_date, end_date, requested_at, approved_at FROM campaigns
        WHERE status IN ('Active', 'Completed') ORDER BY start_date DESC");
    $stmt->execute();
    $campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "campaigns" => $campaigns
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>