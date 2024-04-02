<?php
error_reporting(0);
mysqli_report(MYSQLI_REPORT_OFF);
$conn=new mysqli("localhost","root","","tic_tac_toe");
$data=file_get_contents("php://input");
$data= json_decode($data);
if($data->action=="savePlayer"){
    echo json_encode($data->figure);
    $conn->query("UPDATE `game` SET `pl`='$data->figure'");
}
else if($data->action=="getPlayer"){
    $result=$conn->query("SELECT `pl` FROM `game` WHERE pl='o' OR pl='x'");
    //echo json_encode($result);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            echo json_encode($row['pl']);
        }
    }
}   
else if($data->action=="resetGame"){
    $conn->query("UPDATE `game` SET `0_0`='0',`1_0`='0',`2_0`='0',`0_1`='0',`1_1`='0',`2_1`='0',`0_2`='0',`1_2`='0',`2_2`='0',`pl`='0'");
}
// else if($data->action== "getMOve"){
//     $conn->query("SELECT ");
// }
else if($data->action== ""){
    
}
else{
    echo json_encode("nie ma");
}
$conn->close();
// echo json_encode($data);
//echo json_encode("zmiana");
?>