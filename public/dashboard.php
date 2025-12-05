<?php
session_start();
require_once __DIR__.'/../api/utils.php';
if(empty($_SESSION['user_id'])){
    header('Location: /device-fp/public/index.php'); exit;
}
$pdo = get_db();
$stmt = $pdo->prepare('SELECT username FROM users WHERE id=?');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetchColumn();

$stmt = $pdo->prepare('SELECT id, signature, payload, ip, created_at, anomaly FROM fingerprints WHERE user_id=? ORDER BY created_at DESC LIMIT 20');
$stmt->execute([$_SESSION['user_id']]);
$fprints = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Dashboard</title>
<link rel="stylesheet" href="/device-fp/public/css/styles.css">

</head>
<body>
<div class="container">
<div class="header">
  <div><h1 class="h1">Dashboard</h1><div class="small">Welcome, <?php echo htmlentities($user); ?></div></div>
  <div><a class="btn" href="/device-fp/public/logout.php">Logout</a></div>
</div>
<div class="card">
<h3>Recent fingerprints</h3>
<?php if(!empty($_GET['m'])) echo '<div class="alert">'.htmlentities($_GET['m']).'</div>'; ?>
<table style="width:100%">
<thead><tr><th>Signature</th><th>IP</th><th>When</th><th>Payload (click)</th></tr></thead>
<tbody>
<?php foreach($fprints as $p){
    $cls = $p['anomaly'] ? 'bad' : '';
    echo "<tr class='$cls'>";
    echo "<td><code>".htmlentities(substr($p['signature'],0,16))."...</code></td>";
    echo "<td>".htmlentities($p['ip'])."</td>";
    echo "<td>".htmlentities($p['created_at'])."</td>";
    echo "<td><details><summary>view</summary><pre style='white-space:pre-wrap;'>".htmlentities($p['payload'])."</pre></details></td>";
    echo "</tr>";
} ?>
</tbody>
</table>
</div>
</div
