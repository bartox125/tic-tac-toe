<?php
$data=file_get_contents("php://input");
$data= json_decode($data);
echo json_encode($data);
?>