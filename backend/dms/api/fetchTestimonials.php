<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

try {
    $sql = "
        SELECT 
            t.testimonial_id,
            t.user_id,
            t.message,
            t.rating,
            t.status,
            t.created_at,

            u.email,
            u.role,

            d.full_name AS donor_name,
            d.phone AS donor_phone,
            d.address AS donor_address,

            n.organization_name AS ngo_name,
            n.phone AS ngo_phone,
            n.address AS ngo_address

        FROM testimonials t
        JOIN users u ON t.user_id = u.user_id
        LEFT JOIN donor d ON u.user_id = d.donor_id
        LEFT JOIN ngo n ON u.user_id = n.ngo_id
        WHERE t.status = 'Pending'
        ORDER BY t.created_at DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "testimonials" => $testimonials
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
?>