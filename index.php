<?php
class Message{
    public $action;
    public $id;
    public $player;
    public $nextPlayer;
    public $board;
}
function move($round,$data,$board,$mem){
    $field=$data->id;
    $x=substr($field,0,1);
    $y=substr($field,2,1);
    if($mem->get("board")==false){
        array_splice($board[$y],$x,1,[$_SESSION["player"]]);
        $mem->add("board",$board);
    }
    else{
        $board=$mem->get("board");
        if($board[$y][$x]!=0){
            return false;
        }
        array_splice($board[$y],$x,1,[$_SESSION["player"]]);
        $mem->delete("board");
        $mem->add("board",$board);
        }
    if($mem->get("id")==false){
        $mem->add("id",$data->id);
    }
    else{
        $mem->delete("id");
        $mem->add("id",$data->id);
    }
    $mem->delete("round",0);
    $mem->delete("order",0);
    $mem->delete("player",0);
    $mem->delete('nextPlayer',0);
    $mem->add("round",$round=$round+1);
    $mem->add("player",$_SESSION["player"]);
    $pl=$_SESSION["player"];
    if(checkCrossRight($board,$pl) == true or checkCrossLeft($board,$pl)==true or checkRows($board,$pl)==true or checkColumns($board,$pl)==true){
        $mem->add("order","endGame");
        $mem->add("nextPlayer",$pl);
    }elseif($mem->get("round")==10){
        $mem->add("order","draw");
    }else{
        $mem->add("order","refreshBoard");
        if($pl=="O"){
            $mem->add("nextPlayer",'X');
        }
        else{
            $mem->add("nextPlayer",'O');
        }
    }
}
function checkRows($board,$el){
    for ($y = 0; $y < 3; $y++) {
        $ile = 0;
        for ($x = 0; $x < 3; $x++) {
            if ($board[$y][$x] == $el) {
                $ile= $ile+ 1;
            }
        }
        if ($ile == 3) {
            return true;
        }
    }
    return false;
}
function checkColumns($board,$el){
    for ($x = 0; $x < 3; $x++) {
        $ile = 0;
        for ($y = 0; $y < 3; $y++) {
            if ($board[$y][$x] == $el) {
                $ile = $ile+ 1;
            }
        }
        if ($ile== 3) {
            return true;
        }
    }
    return false;
}
function checkCrossLeft($board,$el){
    $ile=0;
    for($i=0;$i<3;$i++){
        if ($board[$i][$i] == $el) {
            $ile=$ile+1;
        }
    }
    if ($ile== 3) {
        return true;
    }
    else{
        return false;
    }
}
function checkCrossRight($board,$el){
    $ile=0;
    $control=0;
    $x=2;
    $y=0;
    while($control<3){
        if ($board[$y][$x] == $el) {
            $ile=$ile+1;
        }
        $x=$x-1;
        $y=$y+1;
        $control=$control+1;
    }
    if ($ile== 3) {
        return true;
    }
    else{
        return false;
    }
}
if (!class_exists('Memcached')) {
    echo "Rozszerzenie Memcache nie jest dostępne.";
    exit;
}
session_start();
$mem=new Memcached;
$mem->addServer("localhost",11211);
$data=file_get_contents('php://input');
$data=json_decode($data);
$board=array(
    array(0,0,0),
    array(0,0,0),
    array(0,0,0),
);
if ($data->action == 'savePlayer') {
    $_SESSION["player"] = $data->figure;
    $mem->add("player",$data->figure);
    $mem->add("order","setPlayer");
    $mem->add("round",1);
}
elseif($data->action == 'setOtherPlayer'){
    $_SESSION["player"] = $data->figure;
}   
elseif($data->action == "put") {
    $round=$mem->get("round");
    if($_SESSION["player"]=="O" and $round%2!=0){
        move($round,$data,$board,$mem);
    }
    if($_SESSION["player"]=="X" and $round%2==0){
        move($round,$data,$board,$mem);
    }
}
elseif($data->action == "clearMem") {
    $mem->flush();
    session_destroy();
}
elseif($data->action=="giveData"){
    $message=new Message();
    $message->action = $mem->get("order");
    $message->id = $mem->get("id");
    $message->player = $mem->get("player");
    $message->nextPlayer = $mem->get("nextPlayer");
    $message->board = $mem->get("board");
    echo json_encode($message);
}
?> 