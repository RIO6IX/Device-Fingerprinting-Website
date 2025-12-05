<?php session_start(); ?>
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Device Fingerprinting Demo — Login</title>
<link rel="stylesheet" href="/device-fp/public/css/styles.css">
</head>
<body>
<div class="container">
<div class="header">
  <div>
    <h1 class="h1">Device Fingerprinting Demo</h1>
    <div class="small">Login to see device signature and track across the site</div>
  </div>
  <div><a class="btn" href="/device-fp/public/register.php">Register</a></div>
</div>
<hr/>
<div class="grid">
  <div class="card">
    <h3>Login</h3>
    <?php if(!empty($_GET['m'])) echo '<div class="alert">'.htmlentities($_GET['m']).'</div>'; ?>
    <form id="loginForm" method="post" action="/device-fp/api/api_login.php">
        <div class="form-row"><input name="username" placeholder="username" class="input" required></div>
        <div class="form-row"><input name="password" type="password" placeholder="password" class="input" required></div>
        <input type="hidden" name="fp_signature" id="fp_signature">
        <input type="hidden" name="fp_payload" id="fp_payload">
        <button class="btn">Login</button>
    </form>
    <div style="margin-top:12px" class="small">Detected fingerprint will appear in the right pane. This demo sends the fingerprint with the login request.</div>
  </div>
  <div class="card">
    <h3>Collected Device Attributes</h3>
    <div id="attrsBox" class="attrs">Collecting… open console if nothing shows</div>
    <div style="margin-top:8px"><button class="btn" id="collectBtn">Collect & Update Form</button></div>
  </div>
</div>
</div>
<script src="/device-fp/public/js/fingerprint.js"></script>
<script>
const collectBtn = document.getElementById('collectBtn');
collectBtn.addEventListener('click',async ()=>{
    collectBtn.disabled=true; collectBtn.textContent='Collecting...';
    const data = await window.DeviceFP.collectAll();
    document.getElementById('attrsBox').textContent = JSON.stringify(data,null,2);
    document.getElementById('fp_signature').value = data.signature;
    document.getElementById('fp_payload').value = JSON.stringify(data.payload);
    collectBtn.disabled=false; collectBtn.textContent='Collect & Update Form';
});
window.addEventListener('load',async ()=>{
    try{
        const data = await window.DeviceFP.collectAll();
        document.getElementById('attrsBox').textContent = JSON.stringify(data,null,2);
        document.getElementById('fp_signature').value = data.signature;
        document.getElementById('fp_payload').value = JSON.stringify(data.payload);
    }catch(e){
        document.getElementById('attrsBox').textContent = 'Fingerprint collection failed: '+e;
    }
});
</script>
</body>
</html>
