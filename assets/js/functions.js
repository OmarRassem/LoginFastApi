const row1 = document.querySelector("#row-1");
const row2 = document.querySelector("#row-2");
const row3 = document.querySelector("#row-3");

const UserNotFound = 404
const Unauthorized = 401

//login function: username & password => token
async function login(username, password) {

    try {
        let res = await fetch('/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'username': username,
                'password': password
            })
        })

        // Check status of response
        //if the user is found return the token, otherwise throw 404

        if (res.status != UserNotFound) {

            let data = await res.json()
            let token = data.access_token
            if (savedToken == null || savedToken == 'undefined') {
                sessionStorage.setItem('Authentication', token)
                console.log(savedToken)
            }
            return token

        } else {

            throw res.status
        }

    } catch (err) {

        return err
    }

}

//checkUser function: token => username
async function checkUser(token) {

    try {
        let res = await fetch('/whoami', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        // Check status of response
        //if the user is found return the token, otherwise throw 404

        if (res.status != Unauthorized) {

            let data = await res.json()
            let username = data.username

            return username

        } else {

            throw res.status
        }

    } catch (Unauthorized) {

        return Unauthorized
        
    }

}

async function logmeout(token){
    try {
        let res = await fetch('/logmeout', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        // Check status of response
        //if the user is found return the token, otherwise throw 404

        if (res.status != Unauthorized) {

            let data = await res.json()
            let usernameStutus = data.username

            return usernameStutus

        } else {

            throw res.status
        }

    } catch (UserNotFound) {

        return UserNotFound
         
    }

}

function checkLoginData(username, password) {
    let usernameRGEX = /^[a-z\d]+$/i
    let usernameResult = usernameRGEX.test(username)
    if(!usernameResult){
        return {"error" : "invalid username"}
    }
}

async function redirectPage(newUrl) {
    window.location.href = newUrl

}

function renderHTML(id, data) {
    let htmlString = data;
    id.innerHTML = htmlString;
}

function renderHome(){
    renderHTML(row1, `<h1> Welcome!</h1>`)
    renderHTML(row2, `Welcome! Please login to continue.`)
    renderHTML(row3, `<button id="main_btn"><a href="/login">Login</button>`)
}

function renderHomeWithUser(username){
    renderHTML(row2, `<h3> Welcome ${username}!`)
    
}

function renderLogin(){
    renderHTML(row1, `<h2> Login Page </h2>`)
    renderHTML(row2, `<label for="name">Username:</label>
    <input type="text" id="userId" name="name" />
    <label for="pass">Password:</label>
    <input type="password" id="passId" name="pass" />
    <button id="main_btn">Login</button>`)
}

function renderUserHome(res){
    renderHTML(row1, `Welcome Home ${res}!`)
    renderHTML(row2, `<button id="main_btn">Logout</button>`)
}