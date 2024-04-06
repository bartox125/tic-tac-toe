<?php
class Message{
    public $action;
    public $id;
    public $player;
    public $nextPlayer;
}
function move($round,$data,$board,$mem){
    $field=$data->id;
    $x=substr($field,0,1);
    $y=substr($field,2,1);
    if($mem->get("board")==false){
        array_splice($board[$y],$x,1,[$data->figure]);
        $mem->add("board",$board);
    }
    else{
        $board=$mem->get("board");
        if($board[$y][$x]!=0){
            return false;
        }
        array_splice($board[$y],$x,1,[$data->figure]);
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
    $mem->add("player",$data->figure);
    if(checkCrossRight($board,$data->figure) == true or checkCrossLeft($board,$data->figure)==true or checkRows($board,$data->figure)==true or checkColumns($board,$data->figure)==true){
        $mem->add("order","endGame");
        $mem->add("nextPlayer",$data->figure);
    }else{
        $mem->add("order","refreshBoard");
        if($data->figure=='O'){
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
    $mem->add("player",$data->figure);
    $mem->add("order","setPlayer");
    $mem->add("round",1);
}
elseif($data->action == "put") {
    $round=$mem->get("round");
    if($data->figure=='O' and $round%2!=0){
        move($round,$data,$board,$mem);
    }
    if($data->figure=="X" and $round%2== 0){
        move($round,$data,$board,$mem);
    }
}
elseif($data->action == "clearMem") {
    $mem->flush();
}
elseif($data->action=="giveData"){
    $message=new Message();
    $message->action = $mem->get("order");
    $message->id = $mem->get("id");
    $message->player = $mem->get("player");
    $message->nextPlayer = $mem->get("nextPlayer");
    echo json_encode($message);
}
?> 

