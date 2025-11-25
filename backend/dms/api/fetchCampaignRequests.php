<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

try {
    $sql = "SELECT cp.campaign_id, cp.ngo_id, cp.title, cp.description, cp.item_name, cp.target_quantity, 
                   cp.unit, cp.start_date, cp.end_date, cp.requested_at, cp.status,
                   n.organization_name AS ngo_name
            FROM campaigns AS cp
            INNER JOIN ngo AS n ON cp.ngo_id = n.ngo_id
            WHERE cp.status = 'Pending'
            ORDER BY cp.requested_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "requests" => $requests
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>