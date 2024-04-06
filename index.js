const buttons=document.getElementById("buttons")
const btx=document.getElementById("bt0")
const bto=document.getElementById("bt1")
const url="index.php"
let figure=''
function put(id){
    send("put",figure,id)
}
function show(n){
    buttons.style.display='none'
    document.getElementById("move").style.display="block"
    document.getElementById("header").innerText=n
    document.getElementById("move").innerHTML=(figure=='O' ? "twój ruch" : "ruch przeciwnika")
}
btx.addEventListener('click', ()=>{
    figure="X"
    send("savePlayer",figure,null)
})
bto.addEventListener('click', ()=>{
    figure="O"
    send("savePlayer",figure,null)
})
function send(order,pl,id){
    const obj={
        action: order,
        figure: pl,
        id: id
    }
    fetch(url,{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj) 
    })
}
function drawOnBoard(id,el){
    const element = document.getElementById(id)
    element.innerText=el
}
setInterval(() => {
    const obj={
          action: "giveData"  
    }
    fetch(url,{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj) 
    })
    .then(response => response.json())
    .then(data => {
        if(data.action=="setPlayer"){
            if(data.player==figure){
                show("Wybrałeś: "+figure)
            }
            else{
                figure=data.player=='X'? 'O' : 'X'
                show("Pozostaje Ci: "+ figure)
            }
        }
        if(data.action=="refreshBoard"){
            drawOnBoard(data.id, data.player)
            if(data.nextPlayer==figure){
                document.getElementById("move").innerText="twój ruch"
            }
            else{
                document.getElementById("move").innerText="ruch przeciwnika"
            }
        }
        if(data.action=="endGame"){
            drawOnBoard(data.id, data.player)
            document.getElementById("top").style.display="none"
            document.getElementById("win").style.display="block"
            document.getElementById("win").innerText="Wygrały "+data.nextPlayer
        }
    })
}, 500);
window.addEventListener("DOMContentLoaded",send("clearMem","nic"))
