<?php
session_start();
session_unset();
session_destroy();
header('Location: /device-fp/public/index.php?m=Logged+out');
exit;
?>
