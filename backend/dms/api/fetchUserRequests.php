<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

try {
    $stmtDonor = $conn->prepare("SELECT donor_id AS user_id, full_name AS current_name, pending_full_name AS new_name, phone AS current_phone, pending_phone AS new_phone, address AS current_address, pending_address AS new_address, pending_status AS status, requested_at, 'Donor' AS role
                                        FROM donor WHERE pending_status = 'Pending'");
    $stmtDonor->execute();
    $donorRequests = $stmtDonor->fetchAll(PDO::FETCH_ASSOC);

    $stmtNgo = $conn->prepare("SELECT ngo_id AS user_id, organization_name AS current_name, pending_organization_name AS new_name, phone AS current_phone, pending_phone AS new_phone, address AS current_address, pending_address AS new_address, pending_status AS status, requested_at, 'NGO' AS role
                                      FROM ngo WHERE pending_status = 'Pending'");
    $stmtNgo->execute();
    $ngoRequests = $stmtNgo->fetchAll(PDO::FETCH_ASSOC);

    $requests = array_merge($donorRequests, $ngoRequests);

    echo json_encode(["success" => true, "requests" => $requests]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>