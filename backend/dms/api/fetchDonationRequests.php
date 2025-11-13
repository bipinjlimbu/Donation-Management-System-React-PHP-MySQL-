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

            if (!$user_id) {
                echo json_encode([
                    "success" => false,
                    "message" => "Missing user_id"
                ]);
                exit;
            }

            $roleQuery = "SELECT role FROM userdetails WHERE user_id = :user_id";
            $roleStmt = $conn->prepare($roleQuery);
            $roleStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $roleStmt->execute();
            $roleResult = $roleStmt->fetch(PDO::FETCH_ASSOC);

            if (!$roleResult) {
                echo json_encode([
                    "success" => false,
                    "message" => "User not found"
                ]);
                exit;
            }

            $role = $roleResult['role'];

            if ($role === 'Donor') {
                $sql = "SELECT dp.*,
                        cd.title AS campaign_title, cd.campaign_id, 
                        u.username AS ngo
                    FROM donationpending dp
                    JOIN campaigndetails cd ON dp.campaign_id = cd.campaign_id
                    JOIN userdetails u ON cd.ngo_id = u.user_id
                    WHERE dp.donor_id = :user_id";
            } elseif ($role === 'NGO') {
                $sql = "SELECT dp.*,
                        cd.title AS campaign_title, cd.campaign_id,
                        du.username AS donor
                    FROM donationpending dp
                    JOIN campaigndetails cd ON dp.campaign_id = cd.campaign_id
                    JOIN userdetails du ON dp.donor_id = du.user_id
                    WHERE cd.ngo_id = :user_id";
            } elseif ($role === 'Admin') {
                $sql = "SELECT dp.pending_id, dp.quantity AS donated_quantity, dp.status,
                        cd.title AS campaign_name, cd.campaign_id,
                        du.username AS donor, nu.username AS ngo
                    FROM donationpending dp
                    JOIN campaigndetails cd ON dp.campaign_id = cd.campaign_id
                    JOIN userdetails du ON dp.donor_id = du.user_id
                    JOIN userdetails nu ON cd.ngo_id = nu.user_id";
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Invalid user role"
                ]);
                exit;
            }

            $stmt = $conn->prepare($sql);
            if ($role !== 'Admin') {
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