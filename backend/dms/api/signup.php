<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"), true);

$email = strtolower(trim($data['email'] ?? ''));
$password = trim($data['password'] ?? '');

if (!$email || !$password) {
    echo json_encode([
        "success" => false,
        "message" => "Email and password required"
    ]);
    exit;
}

$sql = "SELECT * FROM logindetails WHERE email = :email";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':email', $email);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo json_encode([
        "success" => false,
        "message" => "Email already exists"
    ]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);
$sql = "INSERT INTO logindetails (email, password) VALUES (:email, :password)";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password', $hashedPassword);
$stmt->execute();

echo json_encode([
    "success" => true,
    "message" => "User registered successfully"
]);
?>
