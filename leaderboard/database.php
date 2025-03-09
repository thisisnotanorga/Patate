<?php

$host = "dbhost";
$user = "dbuser";
$pass = "dbpass";
$dbname = "dbname";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connexion échouée : " . $conn->connect_error]));
}
?>