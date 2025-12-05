<?php
require_once 'utils.php';
if($_SERVER['REQUEST_METHOD']!=='POST'){
    header('Location: /device-fp/public/register.php'); exit;
}

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if(!$username || !$password){
    header('Location: /device-fp/public/register.php?m=Missing'); exit;
}

$pdo = get_db();
$stmt = $pdo->prepare('SELECT id FROM users WHERE username=?');
$stmt->execute([$username]);
if($stmt->fetch()){
    header('Location: /device-fp/public/register.php?m=User+exists'); exit;
}

$hash = password_hash($password,PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users(username,password_hash) VALUES(?,?)');
$stmt->execute([$username,$hash]);

header('Location: /device-fp/public/index.php?m=Account+created');
exit;
?>
