<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$user_id = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;

if ($user_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "User ID is required."
    ]);
    exit;
}

try {
    $roleSql = "SELECT role FROM userdetails WHERE user_id = :uid";
    $roleStmt = $conn->prepare($roleSql);
    $roleStmt->bindParam(':uid', $user_id, PDO::PARAM_INT);
    $roleStmt->execute();
    $user = $roleStmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            "success" => false,
            "message" => "User not found."
        ]);
        exit;
    }

    $role = strtolower($user['role']);

    if ($role === 'admin') {
        $sql = "SELECT dh.donation_id, dh.campaign_id, dh.donor_id, dh.ngo_id, dh.quantity, dh.donated_at,
                cd.title AS campaign_title, cd.category, cd.item_type, cd.location,
                d.username AS donor_name, n.username AS ngo_name
                FROM donationhistory dh
                JOIN campaigndetails cd ON dh.campaign_id = cd.campaign_id
                LEFT JOIN userdetails d ON dh.donor_id = d.user_id
                LEFT JOIN userdetails n ON dh.ngo_id = n.user_id
                ORDER BY dh.donated_at DESC";
        $stmt = $conn->prepare($sql);
    } else {
        $sql = "SELECT dh.donation_id, dh.campaign_id, dh.donor_id, dh.ngo_id, dh.quantity, dh.donated_at,
                cd.title AS campaign_title, cd.category, cd.item_type, cd.location,
                d.username AS donor_name, n.username AS ngo_name
                FROM donationhistory dh
                JOIN campaigndetails cd ON dh.campaign_id = cd.campaign_id
                LEFT JOIN userdetails d ON dh.donor_id = d.user_id
                LEFT JOIN userdetails n ON dh.ngo_id = n.user_id
                WHERE dh.donor_id = :user_id OR dh.ngo_id = :user_id
                ORDER BY dh.donated_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    }

    $stmt->execute();
    $donations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($donations) {
        echo json_encode([
            "success" => true,
            "donations" => $donations
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No donation history found."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>