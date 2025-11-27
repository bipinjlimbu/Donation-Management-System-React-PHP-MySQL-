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
    $sql = "SELECT * FROM register WHERE register_id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $register_id);
    $stmt->execute();
    $request = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$request) {
        echo json_encode(["success" => false, "message" => "Request not found"]);
        exit;
    }

    $sql = "INSERT INTO users (email, password_hash, role) 
            VALUES (:email, :password_hash, :role)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':email', $request['email']);
    $stmt->bindParam(':password_hash', $request['password_hash']);
    $stmt->bindParam(':role', $request['role']);
    $stmt->execute();

    $user_id = $conn->lastInsertId();

    if ($request['role'] === 'Donor') {
        $sql = "INSERT INTO donor (donor_id) VALUES (:user_id)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
    }

    if ($request['role'] === 'NGO') {
        $sql = "INSERT INTO ngo (ngo_id, registration_number) VALUES (:user_id, :reg_no)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':reg_no', $request['registration_number']);
        $stmt->execute();
    }

    $sql = "UPDATE register SET status='Approved' WHERE register_id=:id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $register_id);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "User approved successfully"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error approving user"]);
}
?>