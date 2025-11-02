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
            $email = isset($_GET['email']) ? strtolower(trim($_GET['email'])) : '';
            $sql = "SELECT * FROM donationpending WHERE donated_to = :email";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            $donations = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "success" => true,
                "donations" => $donations
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $e->getMessage()
            ]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $campaignName = trim($data['campaign_name']);
        $name = trim($data['item_type'] ?? '');
        $quantity = (int) ($data['quantity'] ?? 0);
        $ngo = strtolower(trim($data['ngo'] ?? ''));
        $donor = strtolower(trim($data['donor'] ?? ''));

        if (!$campaignName || !$name || !$ngo || !$donor || $quantity <= 0) {
            echo json_encode([
                "success" => false,
                "message" => "All fields are required and campaign ID must be valid"
            ]);
            exit;
        }

        try {
            $sql = "INSERT INTO donationpending (campaign_name, item_type, donated_quantity, ngo, donor)
                    VALUES (:campaign_name, :name, :quantity, :ngo, :donor)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':campaign_name', $campaignName, PDO::PARAM_STR);
            $stmt->bindParam(':name', $name, PDO::PARAM_STR);
            $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
            $stmt->bindParam(':ngo', $ngo, PDO::PARAM_STR);
            $stmt->bindParam(':donor', $donor, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    "success" => true,
                    "message" => "Donation added for pending successfully"
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "No request added."
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $e->getMessage()
            ]);
        }
        break;

    default:
        echo json_encode([
            "success" => false,
            "message" => "Unsupported request method."
        ]);
        break;
}
?>