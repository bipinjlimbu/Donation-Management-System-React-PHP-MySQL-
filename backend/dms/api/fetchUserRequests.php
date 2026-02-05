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
    $requests = [];

    if (isset($_SESSION['role']) && $_SESSION['role'] === 'Admin') {

        $stmtDonor = $conn->prepare(
            "SELECT donor_id AS user_id, full_name AS current_name,
                    pending_full_name AS new_name, phone AS current_phone,
                    pending_phone AS new_phone, address AS current_address,
                    pending_address AS new_address, pending_status AS status,
                    requested_at, 'Donor' AS role
             FROM donor
             WHERE pending_status = 'Pending'"
        );
        $stmtDonor->execute();
        $donorRequests = $stmtDonor->fetchAll(PDO::FETCH_ASSOC);

        $stmtNgo = $conn->prepare(
            "SELECT ngo_id AS user_id, organization_name AS current_name,
                    pending_organization_name AS new_name, phone AS current_phone,
                    pending_phone AS new_phone, address AS current_address,
                    pending_address AS new_address, pending_status AS status,
                    requested_at, 'NGO' AS role
             FROM ngo
             WHERE pending_status = 'Pending'"
        );
        $stmtNgo->execute();
        $ngoRequests = $stmtNgo->fetchAll(PDO::FETCH_ASSOC);

        $requests = array_merge($donorRequests, $ngoRequests);
    } else if (isset($_SESSION['role']) && $_SESSION['role'] === 'NGO') {

        $stmt = $conn->prepare(
            "SELECT ngo_id AS user_id,
                    organization_name AS current_name,
                    phone AS current_phone,
                    address AS current_address,
                    pending_organization_name AS new_name,
                    pending_phone AS new_phone,
                    pending_address AS new_address,
                    pending_status AS status,
                    requested_at
             FROM ngo
             WHERE ngo_id = :ngo_id
               AND pending_status = 'Pending'"
        );
        $stmt->bindParam(':ngo_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $stmt->execute();
        $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else if (isset($_SESSION['role']) && $_SESSION['role'] === 'Donor') {

        $stmt = $conn->prepare(
            "SELECT donor_id AS user_id,
                    full_name AS current_name,
                    phone AS current_phone,
                    address AS current_address,
                    pending_full_name AS new_name,
                    pending_phone AS new_phone,
                    pending_address AS new_address,
                    pending_status AS status,
                    requested_at
             FROM donor
             WHERE donor_id = :donor_id
               AND pending_status = 'Pending'"
        );
        $stmt->bindParam(':donor_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $stmt->execute();
        $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode([
        "success" => true,
        "requests" => $requests
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
?>