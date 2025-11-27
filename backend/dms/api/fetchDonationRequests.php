<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

try {
    $user_id = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;

    if (!$user_id) {
        echo json_encode([
            "success" => false,
            "message" => "Missing user_id"
        ]);
        exit;
    }

    $roleQuery = "SELECT role FROM users WHERE user_id = :user_id";
    $roleStmt = $conn->prepare($roleQuery);
    $roleStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $roleStmt->execute();
    $roleResult = $roleStmt->fetch(PDO::FETCH_ASSOC);

    if (!$roleResult) {
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
        exit;
    }

    $role = $roleResult['role'];

    if ($role === 'Donor') {
        $sql = "SELECT d.*, c.title AS campaign_title, n.organization_name AS ngo
                FROM donations d
                JOIN campaigns c ON d.campaign_id = c.campaign_id
                JOIN ngo n ON c.ngo_id = n.ngo_id
                WHERE d.donor_id = :user_id";
    } elseif ($role === 'NGO') {
        $sql = "SELECT d.*, c.title AS campaign_title, u.full_name AS donor
                FROM donations d
                JOIN campaigns c ON d.campaign_id = c.campaign_id
                JOIN donor u ON d.donor_id = u.donor_id
                WHERE c.ngo_id = :user_id";
    } elseif ($role === 'Admin') {
        $sql = "SELECT d.donation_id, d.quantity, d.status,
                       c.title AS campaign_name, c.campaign_id,
                       u.full_name AS donor, n.organization_name AS ngo
                FROM donations d
                JOIN campaigns c ON d.campaign_id = c.campaign_id
                JOIN donor u ON d.donor_id = u.donor_id
                JOIN ngo n ON c.ngo_id = n.ngo_id";
    } else {
        echo json_encode(["success" => false, "message" => "Invalid user role"]);
        exit;
    }

    $stmt = $conn->prepare($sql);
    if ($role !== 'Admin')
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $donations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "donations" => $donations
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>