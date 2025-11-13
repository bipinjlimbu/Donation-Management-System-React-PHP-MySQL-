<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

try {
    $sql = "SELECT cp.*, ud.username AS ngo_name 
            FROM campaignpending AS cp
            INNER JOIN userdetails AS ud ON cp.ngo_id = ud.user_id
            ORDER BY cp.requested_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "requests" => $requests]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>