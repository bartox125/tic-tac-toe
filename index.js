const buttons=document.getElementById("buttons")
const btx=document.getElementById("bt0")
const bto=document.getElementById("bt1")
const url="index.php"
let figura=''
function put(id){
    if(figura!=''){
        const obj={
            action: "put",
            figure: figura,
            id: id
        }
        console.log(obj);
    }
}
function show(n){
    console.log(n);
    buttons.style.display='none'
    document.getElementById("move").style.display="block"
    document.getElementById("header").innerText=n
}
btx.addEventListener('click', ()=>{
    figura="x"
    send()
    //send('x')
})
bto.addEventListener('click', ()=>{
    figura="o"
    send()
    //send('o')
})
function send(){
    const obj={
        action:"savePlayer",
        figure:figura
    }
    fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    })
    .then(response =>response.json())
    .then(data =>{
        console.log("wysłana figura "+data);
    })
}
// document.getElementById("start").addEventListener("click", function(){
//     let i=0
//     setInterval(() => {
//         // const obj={
//         //     id:i,
//         //     figure:"test odpowiedzi"
//         // }
//         // console.log(obj);
//         fetch(url, {
//         //     method: "POST",
//         //     headers: {'Content-Type': 'application/json'},
//         //     body: JSON.stringify(obj)
//         })
//         .then(response =>response.json())
//         .then(data =>{
//             console.log(data+" "+i);
//         })
//         i++
//     }, 500);
// })
window.addEventListener('load', function(){
    let i=0
    let obj;
    setInterval(() => {
        if(i==0){
            obj={action:"resetGame"}
        }
        else if(i==1){
            obj={action:"getPlayer"}
        }
        else{
            obj={action:"getMove"}
        }
        if(i==0){
            i++
        }
        fetch(url,{
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(obj)
        })
        .then(response =>response.json())
        .then(data =>{
            if(typeof(data)=="string"){
                if(data==figura){

                }
                else{
                    if(data=='x'){
                        figura='o'
                    }
                    else{
                        figura='x'
                    }
                }
            }
            console.log("Po otrzymaniu danych "+figura);
            if(data==figura){
                show("Wybrałeś: "+figura)
                i++
            }
            else{
                show("Pozostaje Ci: "+figura)
                i++
            }
        })
    },1000)
})

//wysyła gracza
        // function send(){
        //     let player='O'
        //     let move;
        // }
        // function send() {
        //     let name = document.getElementById("name").value;
        //     let al = document.getElementById("al");
        //     al.className = "show";
        //     let xhttp = new XMLHttpRequest();

        //     xhttp.onreadystatechange = function () {
        //         console.log(this.readyState);
        //         if (this.readyState == 4 && this.status == 200) {
        //             al.className = "hide";
        //             let ob = JSON.parse(this.responseText);
        //             console.log(ob);
        //         }
        //     };

        //     xhttp.open("POST", "ajax.php", true);
        //     xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //     xhttp.send("name=" + encodeURIComponent(name) + "&f=1");
        // }

        // async function test() {
        //     let req = await fetch("http://127.0.0.1/");
        //     let ob = await req.json();
        //     //...
        //     console.log(ob);
        // }

