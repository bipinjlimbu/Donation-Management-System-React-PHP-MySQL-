<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

try {
    if (isset($_SESSION['role']) && $_SESSION['role'] === 'Admin') {
        $stmt = $conn->prepare(
            "SELECT cp.campaign_id, cp.ngo_id, cp.title, cp.description, cp.item_name, 
                    cp.target_quantity, cp.unit, cp.start_date, cp.end_date, cp.requested_at,
                    cp.status, n.organization_name AS ngo_name
             FROM campaigns AS cp
             INNER JOIN ngo AS n ON cp.ngo_id = n.ngo_id
             WHERE cp.status = 'Pending'
             ORDER BY cp.requested_at DESC"
        );
        $stmt->execute();
    } else if (isset($_SESSION['role']) && $_SESSION['role'] === 'NGO') {
        $stmt = $conn->prepare(
            "SELECT cp.campaign_id, cp.ngo_id, cp.title, cp.description, cp.item_name, 
                    cp.target_quantity, cp.unit, cp.start_date, cp.end_date, cp.requested_at,
                    cp.status, n.organization_name AS ngo_name
             FROM campaigns AS cp
             INNER JOIN ngo AS n ON cp.ngo_id = n.ngo_id
             WHERE cp.status = 'Pending' AND cp.ngo_id = :ngo_id
             ORDER BY cp.requested_at DESC"
        );
        $stmt->bindParam(':ngo_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $stmt->execute();
    } else {
        echo json_encode([
            "success" => true,
            "requests" => []
        ]);
        exit;
    }

    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "requests" => $requests,
        "session_user_id" => $_SESSION['user_id'] ?? null
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
?>