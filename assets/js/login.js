const currURL = window.location.href.split(window.location.host)[1]
let savedToken = sessionStorage.getItem('Authentication')


const urls = { HOME: "/", LOGIN: '/login', USER_HOME: '/user_home' }





if (currURL == urls.HOME) {

    const Home = async () => {
        let res = await checkUser(savedToken)
        console.log(res)
        if (res != 401) {
            console.log(res)
            renderHomeWithUser(res)

        } else {
            renderHome()
        }
    }

    Home()

} else if (currURL == urls.LOGIN) {
    const Login = async () => {
        let res = await checkUser(savedToken)
        if (res != 401) {
            //console.log(res)
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
                sessionStorage.setItem('Authentication', token)
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

    Login()

} else if (currURL == urls.USER_HOME) {
    const UserHome = async () => {
        let res = await checkUser(savedToken)
        if (res != 401) {

            await renderUserHome(res)

            const logout = document.querySelector("#main_btn");


            logout.addEventListener('click', async () => {
                console.log("Logging out")
                await logmeout(savedToken)
                sessionStorage.setItem('Authentication', null)

                redirectPage(urls.HOME)
            })

        } else {

            redirectPage(urls.LOGIN)

        }
    }

    UserHome()
}

