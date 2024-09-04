<?php
if (isset($_GET['nombre']) && isset($_GET['mail']) && isset($_GET['foto'])) {
    $nombre = $_GET['nombre'];
    $mail = $_GET['mail'];
    $foto = $_GET['foto'];

    echo "Hello " . htmlspecialchars($nombre) . " your mail is " . htmlspecialchars($mail) . "<br>";
    echo "<img src='" . htmlspecialchars($foto) . "' alt='Profile Picture' style='max-width:100px;'>";
} else {
    echo "No data received.";
}
?>
