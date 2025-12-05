<?php
require_once "utils.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = auth_user();

$signature = $data["signature"] ?? null;
$fingers = $data["full"] ?? null;

if (!$signature || !$fingers) response(false, "Missing fingerprint");

$db = getDB();
$check = $db->prepare("SELECT * FROM fingerprints WHERE signature = ?");
$check->execute([$signature]);

if ($check->rowCount() == 0) {
    $insert = $db->prepare("INSERT INTO fingerprints (user_id, signature, details) VALUES (?, ?, ?)");
    $insert->execute([$user_id, $signature, json_encode($fingers)]);
    response(true, "New device registered");
}

response(true, "Device matched");
?>
