<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

try {
    $activate = $conn->prepare("UPDATE campaigns SET status = 'Active', approved_at = NOW()
        WHERE status = 'Approved' AND start_date <= CURDATE()");
    $activate->execute();

    $complete = $conn->prepare("UPDATE campaigns SET status = 'Completed'
        WHERE status = 'Active'
        AND (
            end_date < CURDATE() 
            OR collected_quantity >= target_quantity
        )
    ");
    $complete->execute();

    $stmt = $conn->prepare("SELECT campaign_id, ngo_id, title, description, item_name, target_quantity, collected_quantity, unit, status, start_date, end_date, requested_at, approved_at FROM campaigns
        WHERE status IN ('Active', 'Completed') AND start_date <= CURDATE() ORDER BY start_date DESC");
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