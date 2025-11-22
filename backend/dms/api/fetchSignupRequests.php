<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

try {
    $sql = "SELECT register_id, username, email, role, registration_number, status, requested_at 
            FROM register WHERE status = 'Pending' ORDER BY requested_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "requests" => $requests
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error fetching signup requests"
    ]);
}
?>