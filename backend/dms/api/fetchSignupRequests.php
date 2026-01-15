<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (!isset($_SESSION['user_id']) || ($_SESSION['role'] ?? '') !== 'Admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

try {
    $sql = "SELECT register_id, email, role, name, phone, address, registration_number, verification_file, status, requested_at
            FROM register 
            WHERE status = 'Pending'
            ORDER BY requested_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "requests" => $requests]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error fetching signup requests", "error" => $e->getMessage()]);
}
?>