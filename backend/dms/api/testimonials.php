<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include 'connectDB.php';
$conn = (new connectDB())->connect();

$userId = $_SESSION['user_id'] ?? null;

try {
    $stmt = $conn->prepare("
        SELECT 
            t.testimonial_id,
            t.user_id,
            t.message,
            t.rating,
            t.created_at,
            u.role,
            d.full_name AS donor_name,
            n.organization_name AS ngo_name
        FROM testimonials t
        JOIN users u ON t.user_id = u.user_id
        LEFT JOIN donor d ON u.user_id = d.donor_id
        LEFT JOIN ngo n ON u.user_id = n.ngo_id
        WHERE t.status = 'Approved'
        ORDER BY t.created_at DESC
    ");
    $stmt->execute();

    $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $hasWritten = false;
    if ($userId) {
        $check = $conn->prepare(
            "SELECT testimonial_id FROM testimonials WHERE user_id = ? LIMIT 1"
        );
        $check->execute([$userId]);
        $hasWritten = $check->fetch() ? true : false;
    }

    echo json_encode([
        "success" => true,
        "testimonials" => $testimonials,
        "hasWritten" => $hasWritten
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
}
