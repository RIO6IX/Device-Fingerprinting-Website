<?php
// api/utils.php

$dbhost = '127.0.0.1';
$dbuser = 'root';
$dbpass = '';
$dbname = 'device_fp_demo';

function get_db() {
    global $dbhost,$dbuser,$dbpass,$dbname;
    static $pdo = null;
    if ($pdo) return $pdo;
    $dsn = "mysql:host=$dbhost;dbname=$dbname;charset=utf8mb4";
    try {
        $pdo = new PDO($dsn,$dbuser,$dbpass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
        return $pdo;
    } catch(PDOException $e) {
        error_log('DB connect error: '.$e->getMessage());
        die('Database error');
    }
}

function log_suspicious($msg){
    $f = __DIR__ . '/../logs/suspicious.log';
    $line = '['.date('Y-m-d H:i:s').'] '.$msg."\n";
    file_put_contents($f,$line,FILE_APPEND);
}

function is_suspicious_device($headers,$fp_payload){
    $ua = strtolower($headers['HTTP_USER_AGENT'] ?? '');
    if(strpos($ua,'burp')!==false || strpos($ua,'curl/')!==false || strpos($ua,'python-requests')!==false) return true;
    if(!empty($headers['HTTP_VIA']) || !empty($headers['HTTP_X_FORWARDED_FOR']) || !empty($headers['HTTP_PROXY_CONNECTION'])) return true;
    
    $payload_data = json_decode($fp_payload,true);
    if($payload_data){
        if(($payload_data['core']['userAgent']??'') !== ($headers['HTTP_USER_AGENT']??'')) return true;
    }
    return false;
}

function record_login_attempt($signature,$ip,$username,$success=0){
    $pdo = get_db();
    $stmt = $pdo->prepare('INSERT INTO login_attempts(signature,ip,username_attempted,success) VALUES(?,?,?,?)');
    $stmt->execute([$signature,$ip,$username,$success]);
}

function recent_failed_attempts($signature,$seconds=60){
    $pdo = get_db();
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM login_attempts WHERE signature=? AND success=0 AND created_at >= (NOW() - INTERVAL ? SECOND)');
    $stmt->execute([$signature,$seconds]);
    return (int)$stmt->fetchColumn();
}
?>
