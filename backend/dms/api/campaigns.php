<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $update = $conn->prepare("UPDATE Campaigns SET status = 'Completed' 
                WHERE status = 'Active' AND (end_date < CURDATE() OR target_quantity <= collected_quantity)");
            $update->execute();

            $stmt = $conn->prepare("SELECT campaign_id, ngo_id, title, description, item_name, target_quantity, collected_quantity, unit, status, start_date, end_date, requested_at, approved_at
                FROM Campaigns WHERE status IN ('Active', 'Completed')
                ORDER BY start_date DESC");
            $stmt->execute();
            $campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "success" => true,
                "campaigns" => $campaigns
            ]);

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $e->getMessage()
            ]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "message" => "Method Not Allowed"
        ]);
        break;
}
?>