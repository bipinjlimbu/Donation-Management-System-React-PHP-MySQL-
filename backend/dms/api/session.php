<?php
session_set_cookie_params([
    'httponly' => true,
    'secure' => false,
    'samesite' => 'None'
]);
session_start();
