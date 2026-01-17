<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);
$donation_id = $data['donation_id'] ?? null;

if (!$donation_id || !isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

try {
    $info = $conn->prepare("
        SELECT d.donor_id, c.title
        FROM donations d
        JOIN campaigns c ON d.campaign_id = c.campaign_id
        WHERE d.donation_id = :id AND d.status = 'Pending'
    ");
    $info->execute(['id' => $donation_id]);
    $row = $info->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode(["success" => false, "message" => "Not found"]);
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE donations
        SET status = 'Delivered', delivered_at = NOW()
        WHERE donation_id = :id
    ");
    $stmt->execute(['id' => $donation_id]);

    $notify = $conn->prepare("
        INSERT INTO notifications (user_id, title, message, status, created_at)
        VALUES (:uid, :title, :msg, 'unread', NOW())
    ");

    $notify->execute([
        'uid' => $row['donor_id'],
        'title' => 'Donation Approved',
        'msg' => 'Your donation for "' . $row['title'] . '" has been approved.'
    ]);

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
}
