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
$registration_number = trim($_POST['registration_number'] ?? null);
$requested_at = date('Y-m-d H:i:s');

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "Required fields missing"]);
    exit;
}

$sql = "SELECT email FROM users WHERE email = :email";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':email', $email);
$stmt->execute();
if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
    exit;
}

$verificationFilePath = null;

if ($role === "NGO") {

    if (!isset($_FILES["verification_file"])) {
        echo json_encode(["success" => false, "message" => "Verification file required"]);
        exit;
    }

    $uploadDir = "uploads/verification/";
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

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

$sql = "INSERT INTO users (email, password_hash, role, registration_number, verification_file, status, requested_at)
        VALUES (:email, :password_hash, :role, :registration_number, :verification_file, 'Pending', :requested_at)";

$stmt = $conn->prepare($sql);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password_hash', $hashedPassword);
$stmt->bindParam(':role', $role);
$stmt->bindParam(':registration_number', $registration_number);
$stmt->bindParam(':verification_file', $verificationFilePath);
$stmt->bindParam(':requested_at', $requested_at);
$stmt->execute();

echo json_encode([
    "success" => true,
    "message" => "Signup submitted! Awaiting admin approval."
]);
?>