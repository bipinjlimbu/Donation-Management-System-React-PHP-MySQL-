<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if (!$user_id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing user_id"
    ]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT user_id, email, role FROM users WHERE user_id = :user_id");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
        exit;
    }

    if ($user['role'] === 'Donor') {
        $stmt = $conn->prepare("SELECT full_name, phone, address FROM donor WHERE donor_id = :donor_id");
        $stmt->bindParam(':donor_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        $details = $stmt->fetch(PDO::FETCH_ASSOC);
        $user = array_merge($user, $details ?: []);
    } elseif ($user['role'] === 'NGO') {
        $stmt = $conn->prepare("SELECT organization_name, registration_number, phone, address FROM ngo WHERE ngo_id = :ngo_id");
        $stmt->bindParam(':ngo_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        $details = $stmt->fetch(PDO::FETCH_ASSOC);
        $user = array_merge($user, $details ?: []);
    }

    echo json_encode([
        "success" => true,
        "user" => $user
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>