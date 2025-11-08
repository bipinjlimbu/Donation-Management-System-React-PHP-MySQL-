<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'connectDB.php';
$objDb = new connectDB();
$conn = $objDb->connect();

try {
    $sql = "SELECT `up`.`pending_id`, `up`.`user_id`, `up`.`new_username`, `up`.`new_role`, `up`.`status`, `up`.`requested_at`, `ud`.`username` AS `current_username`, `ud`.`role` AS `current_role`
            FROM `userpending` AS `up`
            INNER JOIN `userdetails` AS `ud` ON `up`.`user_id` = `ud`.`user_id`
            ORDER BY `up`.`requested_at` DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "requests" => $requests]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>