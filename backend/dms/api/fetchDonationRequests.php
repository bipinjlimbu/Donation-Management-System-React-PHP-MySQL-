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
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false, "message" => "Unauthorized"]);
        exit;
    }

    $user_id = $_SESSION['user_id'];

    $sql = "
        SELECT d.donation_id, d.quantity, d.status, d.requested_at,
               c.campaign_id, c.title AS campaign_title,
               u.full_name AS donor_name
        FROM donations d
        INNER JOIN campaigns c ON d.campaign_id = c.campaign_id
        INNER JOIN donor u ON d.donor_id = u.donor_id
        WHERE c.ngo_id = :ngo_id
          AND d.status = 'Pending'
        ORDER BY d.requested_at DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':ngo_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "donations" => $stmt->fetchAll(PDO::FETCH_ASSOC),
        "session_user_id" => $_SESSION['user_id']
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
