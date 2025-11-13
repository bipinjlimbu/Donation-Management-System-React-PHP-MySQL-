<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);
$id = (int) ($data['id'] ?? 0);
$type = trim($data['type'] ?? '');

if (!$id || empty($type)) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required parameters."
    ]);
    exit;
}

try {
    $table = '';
    if ($type === 'user') {
        $table = 'userpending';
    } elseif ($type === 'donation') {
        $table = 'donationpending';
    } elseif ($type === 'campaign') {
        $table = 'campaignpending';
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Invalid record type."
        ]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM $table WHERE pending_id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => ucfirst($type) . " record deleted successfully."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Record not found or already deleted."
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>