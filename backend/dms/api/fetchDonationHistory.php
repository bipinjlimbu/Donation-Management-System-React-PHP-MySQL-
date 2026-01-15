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

$user_id = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;

if ($user_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "User ID is required."
    ]);
    exit;
}

try {
    $roleSql = "SELECT role FROM users WHERE user_id = :uid";
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

    $role = $user['role'];

    if ($role === 'Admin') {
        $sql = "SELECT d.*, c.title AS campaign_title, c.item_name, dn.full_name AS donor_name, ng.organization_name AS ngo_name, ng.address AS ngo_address
                FROM donations d
                JOIN campaigns c ON d.campaign_id = c.campaign_id
                JOIN donor dn ON d.donor_id = dn.donor_id
                JOIN ngo ng ON c.ngo_id = ng.ngo_id
                WHERE d.status != 'Pending'
                ORDER BY d.delivered_at DESC, d.requested_at DESC";
        $stmt = $conn->prepare($sql);
    } else {
        $sql = "SELECT d.*, c.title AS campaign_title, c.item_name, dn.full_name AS donor_name, ng.organization_name AS ngo_name, ng.address AS ngo_address
                FROM donations d
                JOIN campaigns c ON d.campaign_id = c.campaign_id
                JOIN donor dn ON d.donor_id = dn.donor_id
                JOIN ngo ng ON c.ngo_id = ng.ngo_id
                WHERE d.donor_id = :uid OR c.ngo_id = :uid
                ORDER BY d.delivered_at DESC, d.requested_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':uid', $user_id, PDO::PARAM_INT);
    }

    $stmt->execute();
    $donations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "donations" => $donations,
        "session_user_id" => $_SESSION['user_id'] ?? null
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>