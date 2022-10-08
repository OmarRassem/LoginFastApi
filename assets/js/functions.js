//BACKEND HANDLING FUNCTIONS

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
                sessionStorage.setItem(sessionAuthItem, token)
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
        //if the user is found return the username, otherwise throw 401

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

// Logmeout: calls GET to register the user has logged out in the db
async function logmeout(token) {
    try {
        let res = await fetch('/logmeout', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        // Check status of response
        /*if the user is found return the username status(0 = not active, 1 = active),
         otherwise throw 404
        */
        if (res.status != Unauthorized) {

            let data = await res.json()
            let usernameStutus = data.is_active

            return usernameStutus

        } else {

            throw res.status
        }

    } catch (UserNotFound) {

        return UserNotFound

    }

}


//RENDERING FUNCTIONS
/**********************/

const row1 = document.querySelector("#row-1");
const row2 = document.querySelector("#row-2");
const row3 = document.querySelector("#row-3");
const tabTitle = document.querySelector("#title");

//redirect page to new url
async function redirectPage(newUrl) {
    window.location.href = newUrl
}

//render inner html based on id 
function renderHTML(id, data) {
    let htmlString = data;
    id.innerHTML = htmlString;
}

// Home page renderer 
function renderHome() {
    renderHTML(tabTitle, `Welcome!`)
    renderHTML(row1, `<h1> Welcome!</h1>`)
    renderHTML(row2, `Welcome! Please login to continue.`)
    renderHTML(row3, `<button id="main_btn"><a href="/login">Login</button>`)
}

// Home page with user logged in renderer 
function renderHomeWithUser(username) {
    renderHTML(tabTitle, `${username}'s Home Page!`)
    renderHTML(row1, `<h1> Welcome! </h1>`)
    renderHTML(row2, `Welcome ${username}!`)
    renderHTML(row3, `<button id="main_btn"><a href="/user_home">Check Your Home</button>`)
}

// Login page renderer
function renderLogin() {
    renderHTML(tabTitle, `Login Page`)
    renderHTML(row1, `<h2> Login Page </h2>`)
    renderHTML(row2, `<label for="name">Username:</label>
    <input type="text" id="userId" name="name" />
    <label for="pass">Password:</label>
    <input type="password" id="passId" name="pass" />
    <button id="main_btn">Login</button>`)
}

//User home page renderer
function renderUserHome(res) {
    renderHTML(tabTitle, `${res}'s Page`)
    renderHTML(row1, `Welcome Home ${res}!`)
    renderHTML(row2, `<button id="main_btn">Logout</button> 
    <button id="main_btn"><a href="/">Home</button>`)

}


//Handles the User home page rendering based on token
async function UserHome() {
    let res = await checkUser(savedToken)

    //if user is authorized delete token from session storage and log out
    if (res != 401) {

        await renderUserHome(res)

        const logout = document.querySelector("#main_btn");


        logout.addEventListener('click', async () => {
            console.log("Logging out")
            await logmeout(savedToken)
            sessionStorage.setItem(sessionAuthItem, null)

            redirectPage(urls.HOME)
        })

    } else {

        redirectPage(urls.LOGIN)

    }
}


//Handles the Login page rendering based on token
async function Login() {
    let res = await checkUser(savedToken)

    if (res != 401) {

        redirectPage(urls.USER_HOME)

    } else {
        await renderLogin()

        const loginPage = document.querySelector("#main_btn");
        const userInput = document.querySelector('#userId');
        const passInput = document.querySelector("#passId");

        loginPage.addEventListener('click', async () => {
            let username = userInput.value;
            let password = passInput.value;

            let token = await login(username, password)
            sessionStorage.setItem(sessionAuthItem, token)
            console.log(token)
            if (token != null && token != 404 && token != 'undefined') {
                renderHTML(row3, `Login Successful. Directing to home page...`)
                redirectPage(urls.USER_HOME)
            } else {
                renderHTML(row3, `Please enter the correct credentials.`)
            }

        })

    }
}


//Handles the Home page rendering based on token
async function Home() {
    let res = await checkUser(savedToken)
    console.log(res)
    if (res != 401) {

        renderHomeWithUser(res)

    } else {

        renderHome()

    }
}