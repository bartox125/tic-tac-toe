const buttons=document.getElementById("buttons")
const btx=document.getElementById("bt0")
const bto=document.getElementById("bt1")
let figura='o'
function put(el){
    console.log(figura);
    console.log('insert');
    if(figura=='o'){
        console.log("tworzenie");
        const div=document.createElement("div")
        div.classList.add("circle")
        el.append(div)
        console.log("done");
    }
}
function show(){
    buttons.style.display='none'
    document.getElementById("move").style.display="block"
}
btx.addEventListener('click', ()=>{
    figura="x"
    show()
    //send('x')
})
bto.addEventListener('click', ()=>{
    figura="o"
    show()
    //send('o')
})
function send(id){
    const url="ajax.php"
    const obj={
        id:id,
        figure:figura
    }
    console.log(obj);
}
//wysyła gracza
function sendObject(){
    const url="ajax.php"
    const obj={

    }
}
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

