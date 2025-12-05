<?php session_start(); ?>
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Register — Device Fingerprint Demo</title>
<style>
* {margin:0;padding:0;box-sizing:border-box;}
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
.container {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    max-width: 400px;
    width: 90%;
    text-align: center;
}
h1 { color:#333; margin-bottom:1rem; font-size:1.8rem; }
#status { color:#666; margin-bottom:1.5rem; font-size:0.95rem; }
.login-form { display:flex; flex-direction:column; gap:1rem; }
input { padding:12px 16px; border:2px solid #e1e5e9; border-radius:8px; font-size:1rem; transition:border-color 0.3s; }
input:focus { outline:none; border-color:#667eea; }
button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; padding:14px; border:none; border-radius:8px; font-size:1.1rem; font-weight:600; cursor:pointer; transition:transform 0.2s; }
button:hover { transform: translateY(-2px); }
.result { margin-top:1.5rem; padding:1rem; border-radius:8px; font-weight:600; }
.success { background:#d4edda;color:#155724;border:1px solid #c3e6cb; }
.error { background:#f8d7da;color:#721c24;border:1px solid #f5c6cb; }
</style>
</head>
<body>
<div class="container">
    <h1>Register</h1>
    <?php if(!empty($_GET['m'])): ?>
        <div class="result error"><?php echo htmlentities($_GET['m']); ?></div>
    <?php endif; ?>
    <form class="login-form" method="post" action="/device-fp/api/api_register.php">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Create Account</button>
    </form>
    <div id="status">
        Already have an account? <a href="/device-fp/public/index.php" style="color:#667eea;">Login</a>
    </div>
</div>
</body>
</html>
