const loginPage = document.getElementById("main_btn");
const row1 = document.getElementById("row-1");
const row2 = document.getElementById("row-2");
const row3 = document.getElementById("row-3");

/* loginPage.addEventListener("click", function (e) {
    console.log("HI");
    //httpGetAsync('/login')
    window.location.href = '/login';
}); */



let whoami = new XMLHttpRequest()
whoami.open('GET', '/whoami')
whoami.onload = function () {
    let jsonData = JSON.parse(whoami.responseText)
    console.log(jsonData)
    renderHTML(row1,"<h1>" + jsonData.content + "</h1>")
}
whoami.send()

function renderHTML(id,data){
    let htmlString = data;
    id.innerHTML = htmlString; 

}