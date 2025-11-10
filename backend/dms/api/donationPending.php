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
            $user_id = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;
            $role = isset($_GET['role']) ? strtolower(trim($_GET['role'])) : '';

            if (!$user_id || !$role) {
                echo json_encode([
                    "success" => false,
                    "message" => "Missing user_id or role"
                ]);
                exit;
            }

            if ($role === 'donor') {
                $sql = "SELECT dp.*, cd.title AS campaign_title
                        FROM DonationPending dp
                        JOIN CampaignDetails cd ON dp.campaign_id = cd.campaign_id
                        WHERE dp.donor_id = :user_id";
            } else if ($role === 'ngo') {
                $sql = "SELECT dp.*, cd.title AS campaign_title
                        FROM DonationPending dp
                        JOIN CampaignDetails cd ON dp.campaign_id = cd.campaign_id
                        WHERE cd.ngo_id = :user_id";
            } else if ($role === 'admin') {
                $sql = "SELECT dp.*, cd.title AS campaign_title
                        FROM DonationPending dp
                        JOIN CampaignDetails cd ON dp.campaign_id = cd.campaign_id";
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Invalid role"
                ]);
                exit;
            }

            $stmt = $conn->prepare($sql);
            if ($role !== 'admin') {
                $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            }
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

        $donor_id = (int) ($data['donor_id'] ?? 0);
        $campaign_id = (int) ($data['campaign_id'] ?? 0);
        $quantity = (float) ($data['quantity'] ?? 0);

        if (!$donor_id || !$campaign_id || $quantity <= 0) {
            echo json_encode([
                "success" => false,
                "message" => "All fields are required and amount must be greater than zero"
            ]);
            exit;
        }

        try {
            $sql = "INSERT INTO donationpending (donor_id, campaign_id, quantity, status)
                    VALUES (:donor_id, :campaign_id, :quantity, 'Pending' )";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':donor_id', $donor_id, PDO::PARAM_INT);
            $stmt->bindParam(':campaign_id', $campaign_id, PDO::PARAM_INT);
            $stmt->bindParam(':quantity', $quantity, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    "success" => true,
                    "message" => "Donation request submitted successfully!"
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to submit donation request."
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