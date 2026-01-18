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
    if (!isset($_SESSION['user_id'], $_SESSION['role'])) {
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized"
        ]);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $role = $_SESSION['role'];

    if ($role === "NGO") {

        $sql = "
            SELECT 
                d.donation_id,
                d.quantity,
                d.status,
                d.requested_at,
                c.campaign_id,
                c.title AS campaign_title,
                c.item_name,
                u.full_name AS donor
            FROM donations d
            INNER JOIN campaigns c ON d.campaign_id = c.campaign_id
            INNER JOIN donor u ON d.donor_id = u.donor_id
            WHERE c.ngo_id = :ngo_id
              AND d.status = 'Pending'
            ORDER BY d.requested_at DESC
        ";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':ngo_id', $user_id, PDO::PARAM_INT);
    } elseif ($role === "Donor") {

        $sql = "
            SELECT 
                d.donation_id,
                d.quantity,
                d.status,
                d.requested_at,
                c.campaign_id,
                c.title AS campaign_title,
                c.item_name,
                n.organization_name AS ngo_name
            FROM donations d
            INNER JOIN campaigns c ON d.campaign_id = c.campaign_id
            INNER JOIN ngo n ON c.ngo_id = n.ngo_id
            WHERE d.donor_id = :donor_id
              AND d.status = 'Pending'
            ORDER BY d.requested_at DESC
        ";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':donor_id', $user_id, PDO::PARAM_INT);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Invalid role"
        ]);
        exit;
    }

    $stmt->execute();

    echo json_encode([
        "success" => true,
        "donations" => $stmt->fetchAll(PDO::FETCH_ASSOC),
        "session_user_id" => $user_id,
        "role" => $role
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
