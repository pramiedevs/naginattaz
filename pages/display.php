<?php
if (isset($_POST['nombre']) && isset($_POST['mail']) && isset($_POST['foto'])) {
    $nombre = $_POST['nombre'];
    $mail = $_POST['mail'];
    $foto = $_POST['foto'];

    echo "Hello " . htmlspecialchars($nombre) . " your mail is " . htmlspecialchars($mail) . "<br>";
    echo "<img src='" . htmlspecialchars($foto) . "' alt='Profile Picture' style='max-width:100px;'>";
} else {
    echo "No data received.";
}
?>
