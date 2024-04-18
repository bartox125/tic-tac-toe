const buttons=document.getElementById("buttons")
const btx=document.getElementById("bt0")
const bto=document.getElementById("bt1")
const cover=document.getElementById("endLine")
const url="index.php"
const circle=`<svg width="100" height="100">
<circle cx="50" cy="50" r="40" stroke="red" stroke-width="10" fill="white"/>
</svg>`
const cross=`<svg width="100px" height="100px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<line class="cross" x1="10" y1="10" x2="90" y2="90"/>
<line class="cross" x1="90" y1="10" x2="10" y2="90"/>
</svg>`
let winner;
let idArray=[];
let figure=''
function findElements(element,board){
    checkCols(element,board)
    checkRows(element,board)
    checkLeft(element,board)
    checkRight(element,board)
    drawLine()
}
function checkRows(element,board){
    for(let y=0;y<3;y++){
        let ile=0
        for(let x=0;x<3;x++){
            if(board[y][x]==element){
                ile++
            }
        }
        if(ile==3){
            return winner={direction: "row", level: y}
        }
    }
}
function checkCols(element,board){
    for(let x=0;x<3;x++){
        let ile=0
        for(let y=0;y<3;y++){
            if(board[y][x]==element){
                ile++
            }
        }
        if(ile==3){
            return winner={direction: "col", level: x}
        }
    }
}
function checkLeft(element,board){
    let ile=0
    for(let i=0;i<3;i++){
        if(board[i][i]==element){
            ile++
        }
    }
    if(ile==3){
        return winner={direction:"left"}
    }
}
function checkRight(element,board){
    let ile=0
    let y=0
    let x=2
    while(y<3){
        if(board[y][x]==element){
            ile++
        }
        y++
        x--
    }
    if(ile==3){
        return winner={direction:"right"}
    }
}
function drawLine(){
    if(winner.direction=="row"){
        const line=`<line class="end" x1="0" y1="${winner.level*102+50}" y2="${winner.level*102+50}" x2="305"/>`
        endLine.innerHTML=line
    }
    else if(winner.direction=="col"){
        const line=`<line class="end" x1="${winner.level*102+50}" y1="0" y2="309" x2="${winner.level*102+50}"/>`
        endLine.innerHTML=line
    }
    else if(winner.direction=="left"){
        const line=`<line class="endSides" x1="5" y1="5" y2="304" x2="300"/>`
        endLine.innerHTML=line
    }
    else{
        const line=`<line class="endSides" x1="300" y1="5" y2="304" x2="5"/>`
        endLine.innerHTML=line
    }
}
function put(id){
    send("put",figure,id)
}
function show(n){
    buttons.style.display='none'
    document.getElementById("move").style.display="block"
    document.getElementById("header").innerText=n
    document.getElementById("move").innerHTML=(figure=='O' ? "twój ruch" : "ruch przeciwnika")
}
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
function drawOnBoard(id,figure){
    const element = document.getElementById(id)
    element.innerHTML= figure=="O"? circle : cross
}
function comunicat(text){
    document.getElementById("header").style.display="none"
    document.getElementById("move").style.display="none"
    document.getElementById("win").style.display="block"
    document.getElementById("win").innerText=text
}
btx.addEventListener('click', ()=>{
    figure="X"
    send("savePlayer",figure,null)
})
bto.addEventListener('click', ()=>{
    figure="O"
    send("savePlayer",figure,null)
})
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
                send("setOtherPlayer", figure, null)
            }
        }
        if(data.action=="refreshBoard"){
            if(idArray.includes(data.id)==false){
                idArray.push(data.id)
                drawOnBoard(data.id, data.player)
                if(data.nextPlayer==figure){
                    document.getElementById("move").innerText="twój ruch"
                }
                else{
                    document.getElementById("move").innerText="ruch przeciwnika"
                }
            }
        }
        if(data.action=="endGame"){
            if(idArray.includes(data.id)==false){
                idArray.push(data.id)
                drawOnBoard(data.id, data.player)
                setTimeout(() => {
                    comunicat("Wygrały "+data.nextPlayer)
                    findElements(data.nextPlayer, data.board)
                }, 750);
            }
        }
        if(data.action=="draw"){
            if(idArray.includes(data.id)==false){
                idArray.push(data.id)
                drawOnBoard(data.id, data.player)
                setTimeout(() => {
                    comunicat("Remis")
                }, 750);
            }
        }
    })
}, 300);
window.addEventListener("DOMContentLoaded",send("clearMem"))