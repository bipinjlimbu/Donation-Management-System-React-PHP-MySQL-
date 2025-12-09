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
    $reg = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$reg) {
        echo json_encode(["success" => false, "message" => "Registration request not found"]);
        exit;
    }

    if (!empty($reg['verification_file']) && file_exists($reg['verification_file'])) {
        @unlink($reg['verification_file']);
    }

    $sql = "UPDATE register SET status = 'Denied' WHERE register_id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $register_id);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Signup request denied"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error denying signup",
        "error" => $e->getMessage()
    ]);
}
?>