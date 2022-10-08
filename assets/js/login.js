//Current url in browser
const currURL = window.location.href.split(window.location.host)[1]

//Session storage in browser for tokens
const sessionAuthItem = 'Authentication'
let savedToken = sessionStorage.getItem(sessionAuthItem)

//enum of Page Urls 
const urls = { HOME: "/", LOGIN: '/login', USER_HOME: '/user_home' }


//check current page url to match the correct renderer
if (currURL == urls.HOME) {

    Home()

} else if (currURL == urls.LOGIN) {

    Login()

} else if (currURL == urls.USER_HOME) {

    UserHome()
}


