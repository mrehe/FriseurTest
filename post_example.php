<?php
if (isset($_POST['name'])) {
    $name = $_POST['name'];
    echo "Hallo, " . htmlspecialchars($name) . "!";
} else {
    echo "Kein Name angegeben!";
}
?>