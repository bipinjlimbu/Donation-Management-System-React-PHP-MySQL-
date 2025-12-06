<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$email = strtolower(trim($_POST['email'] ?? ''));
$password = trim($_POST['password'] ?? '');
$role = $_POST['role'] ?? 'Donor';
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$address = trim($_POST['address'] ?? '');
$registration_number = trim($_POST['registration_number'] ?? null);
$requested_at = date('Y-m-d H:i:s');

if (!$email || !$password || !$name) {
    echo json_encode(["success" => false, "message" => "Required fields missing"]);
    exit;
}

$sql = "SELECT r.register_id 
        FROM register r 
        WHERE r.status = 'Approved' AND r.user_id IN (SELECT user_id FROM users WHERE email = :email)";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':email', $email);
$stmt->execute();
if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "Email already registered and approved"]);
    exit;
}

$verificationFilePath = null;
if ($role === "NGO") {
    if (!isset($_FILES["verification_file"])) {
        echo json_encode(["success" => false, "message" => "Verification file required"]);
        exit;
    }

    $uploadDir = "uploads/verification/";
    if (!file_exists($uploadDir))
        mkdir($uploadDir, 0777, true);

    $filename = time() . "_" . basename($_FILES["verification_file"]["name"]);
    $targetFile = $uploadDir . $filename;

    if (move_uploaded_file($_FILES["verification_file"]["tmp_name"], $targetFile)) {
        $verificationFilePath = $targetFile;
    } else {
        echo json_encode(["success" => false, "message" => "File upload failed"]);
        exit;
    }
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$sql = "INSERT INTO register 
        (user_id, role, name, phone, address, registration_number, verification_file, status, requested_at) 
        VALUES 
        (NULL, :role, :name, :phone, :address, :registration_number, :verification_file, 'Pending', :requested_at)";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':role', $role);
$stmt->bindParam(':name', $name);
$stmt->bindParam(':phone', $phone);
$stmt->bindParam(':address', $address);
$stmt->bindParam(':registration_number', $registration_number);
$stmt->bindParam(':verification_file', $verificationFilePath);
$stmt->bindParam(':requested_at', $requested_at);
$stmt->execute();

echo json_encode([
    "success" => true,
    "message" => "Signup submitted! Awaiting admin approval."
]);
?>