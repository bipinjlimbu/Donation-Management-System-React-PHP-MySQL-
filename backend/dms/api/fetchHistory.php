<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$email = isset($_GET['email']) ? $_GET['email'] : '';

if (empty($email)) {
    echo json_encode([
        "success" => false,
        "message" => "Missing email"
    ]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT * FROM donationhistory WHERE donor = :email OR ngo = :email");
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();
    $donations = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($donations) {
        echo json_encode([
            "success" => true,
            "donations" => $donations
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Donation History not found."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>