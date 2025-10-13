<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data['fullname'] ?? '');
$role = trim($data['role'] ?? '');
$email = strtolower(trim($data['email'] ?? ''));

if (!$name || !$role || !$email) {
    echo json_encode([
        "success" => false,
        "message" => "Fullname, role and email are required"
    ]);
    exit;
}

try {
    $sql = "UPDATE logindetails SET name = :name, role = :role WHERE email = :email";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':role', $role);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Details updated successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No record updated. Check email or no changes made."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
