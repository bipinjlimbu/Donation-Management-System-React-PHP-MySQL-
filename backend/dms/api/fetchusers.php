<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
    exit;

include 'session.php';
include 'connectDB.php';

if (($_SESSION['role'] ?? null) !== 'Admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

try {
    $conn = (new connectDB())->connect();

    $sql = "SELECT 
                r.register_id, 
                r.email, 
                r.name, 
                r.phone, 
                r.role, 
                r.status, 
                u.user_id 
            FROM register r
            LEFT JOIN users u ON r.user_id = u.user_id
            ORDER BY r.requested_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "users" => $users]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error"]);
}
?>