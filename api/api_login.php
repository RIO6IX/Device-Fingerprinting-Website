<?php
require_once 'utils.php';
session_start();

if($_SERVER['REQUEST_METHOD']!=='POST'){
    header('Location: /device-fp/public/index.php'); exit;
}

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';
$signature = $_POST['fp_signature'] ?? '';
$payload = $_POST['fp_payload'] ?? '{}';
$ip = $_SERVER['REMOTE_ADDR'];
$headers = getallheaders();
$pdo = get_db();

// simple auth
$stmt = $pdo->prepare('SELECT id,password_hash FROM users WHERE username=?');
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if(!$user || !password_verify($password,$user['password_hash'])){
    record_login_attempt($signature,$ip,$username,0);
    header('Location: /device-fp/public/index.php?m=Invalid+login'); exit;
}

// check for suspicious device/tool
if(is_suspicious_device($_SERVER,$payload)){
    log_suspicious("Suspicious tool/proxy detected for $username ip $ip");
    header('Location: /device-fp/public/index.php?m=Abnormal+device+detected'); exit;
}

// check existing fingerprint
$stmt = $pdo->prepare('SELECT signature FROM fingerprints WHERE user_id=? ORDER BY created_at DESC LIMIT 1');
$stmt->execute([$user['id']]);
$last = $stmt->fetchColumn();

if($last && $last !== $signature){
    log_suspicious("Fingerprint mismatch for $username ip $ip");
    header('Location: /device-fp/public/index.php?m=Abnormal+device+detected'); exit;
}

// first login: save fingerprint
if(!$last){
    $stmt = $pdo->prepare('INSERT INTO fingerprints(user_id,signature,payload,ip,user_agent,anomaly) VALUES(?,?,?,?,?,0)');
    $stmt->execute([$user['id'],$signature,$payload,$ip,$headers['User-Agent'] ?? '']);
}

// record login
record_login_attempt($signature,$ip,$username,1);

// set session
$_SESSION['user_id'] = $user['id'];
header('Location: /device-fp/public/dashboard.php');
exit;
?>
