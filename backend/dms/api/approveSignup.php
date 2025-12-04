<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: *");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);
$register_id = $data['register_id'] ?? null;

if (!$register_id) {
    echo json_encode(["success" => false, "message" => "Missing register_id"]);
    exit;
}

try {
    $sql = "SELECT * FROM users WHERE user_id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $register_id);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit;
    }

    $sql = "UPDATE users SET status='Approved', approved_at=NOW() WHERE user_id=:id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $register_id);
    $stmt->execute();

    if ($user['role'] === 'Donor') {
        $sql = "INSERT INTO donor (donor_id, pending_status, requested_at, approved_at)
                VALUES (:user_id, 'Approved', :requested_at, NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':user_id', $register_id);
        $stmt->bindParam(':requested_at', $user['requested_at']);
        $stmt->execute();
    }

    if ($user['role'] === 'NGO') {
        $sql = "INSERT INTO ngo (ngo_id, registration_number, pending_status, requested_at, approved_at)
                VALUES (:user_id, :reg_no, 'Approved', :requested_at, NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':user_id', $register_id);
        $stmt->bindParam(':reg_no', $user['registration_number']);
        $stmt->bindParam(':requested_at', $user['requested_at']);
        $stmt->execute();
    }

    echo json_encode([
        "success" => true,
        "message" => "User approved successfully"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error approving user",
        "error" => $e->getMessage()
    ]);
}
?>