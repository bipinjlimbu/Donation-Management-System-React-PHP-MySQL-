<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$conn = (new connectDB())->connect();

$data = json_decode(file_get_contents("php://input"), true);
$donation_id = (int) ($data['donation_id'] ?? 0);

if (!$donation_id) {
    echo json_encode([
        "success" => false,
        "message" => "Donation ID is required."
    ]);
    exit;
}

try {
    $infoStmt = $conn->prepare("
        SELECT d.donor_id, c.title
        FROM donations d
        JOIN campaigns c ON c.campaign_id = d.campaign_id
        WHERE d.donation_id = :donation_id AND d.status = 'Pending'
    ");
    $infoStmt->bindParam(':donation_id', $donation_id, PDO::PARAM_INT);
    $infoStmt->execute();
    $info = $infoStmt->fetch(PDO::FETCH_ASSOC);

    if (!$info) {
        echo json_encode([
            "success" => false,
            "message" => "No matching pending donation found."
        ]);
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE donations 
        SET status = 'Denied' 
        WHERE donation_id = :donation_id AND status = 'Pending'
    ");
    $stmt->bindParam(':donation_id', $donation_id, PDO::PARAM_INT);
    $stmt->execute();

    $notify = $conn->prepare("
        INSERT INTO notifications (user_id, title, message, status, created_at)
        VALUES (:user_id, :title, :message, 'unread', NOW())
    ");

    $title = "Donation Denied";
    $message = "Your donation request for \"{$info['title']}\" was denied by the NGO.";

    $notify->bindParam(':user_id', $info['donor_id'], PDO::PARAM_INT);
    $notify->bindParam(':title', $title);
    $notify->bindParam(':message', $message);
    $notify->execute();

    echo json_encode([
        "success" => true,
        "message" => "Donation denied and notification sent."
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
?>