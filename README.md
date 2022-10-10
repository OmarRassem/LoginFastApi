# Simple Login Authentication System Using FastAPI

_This webapp was part of the Ethereal Marketplace assessment._

This simple login webapp api implements OAuth2, JWT, HTTP and SQLite to create a FastAPI app that authenticates user logins. In addition, it mostly involves dynamic rendering of the frontend using vanilla JavaScript.

## Install

```bash
git clone https://github.com/OmarRassem/LoginFastApi
cd LoginFastApi
```

### Setup venv

```bash
python -m venv env
source env/Scripts/activate
```

### Install with pip

```bash
pip install -r requirements.txt
```

### Running the app

Ps: activating the venv is needed

```bash
python main.py
```

### Testing the Login Functionality

To allow testing, the repo includes the Sqlite db which has some users.

Test the following username and password:

```md
username = omar
password = mypass
```

***

## Database

The database used was Sqlite with the tortoise orm which uses the pydantic model for data validation and management.

The database included in the repo is populated with a couple of users for testing similar to the table below:

|id|username|password_hash|is_active|
|----|----|----|----|
|1|john|$2b$12$zl3rF...tarkVZKV5O|0|

_The api has a backend point to create more users (The app does not include a signup function in the frontend)_

***

## The Backend

The backend files are split into `model.py` and `main.py`.

The model file includes the database's user model based on the tortoise-orm model.  

The main file includes the FastAPI app and the app functions.

### Creating new users

Creating new users could be done by sending a POST request to `/users` to the api with a body as shown below:

```JSON
{
  "username": "string",
  "password_hash": "string",
  "is_active": false
}
```

Another way is by accessing the FastAPI built-in docs UI through [Localhost:8000/docs](http://127.0.0.1:8000/docs "FastApi UI") and executing a POST request.

### Login Token Generator

The api generates a JWT token with every login request. This is done through a POST request in the `x-www-form-urlencoded` format and request body as shown below:

```JSON
{
    "username": "string",
    "password_hash": "string"
}
```

The HTTP response is in the form:

```JSON
{
    "access_token": "token",
    "token_type": "bearer"
 }
```

Once the user is authenticated and a new token is created, the `access_token` is saved in the local browser session storage to track the user across other requests.

### Getting the user details

In order to display the username in the user home page, a GET request is made to `/whoami` which includes the user token in the request's header under `'Authentecation'`.

The json response includes the username to be displayed.

### Logout

Once the user attempts to logout, a GET request is sent with the token to `/logmeout` (To update the database `is_active` for the user) and the local session authentication token is deleted.

### Static Files Handling

The frontend is served the same `index.html` file through three main GET requests:

[`/`, `/login`, `/user_home`]

***

## Frontend

### Parsing the Static Files

The backend serves the `index.html` which references two JavaScript files, `login.js` and `functions.js`.

The former takes care of checking the current browser URL and executes the rendering functions accordingly. The latter includes all the functions used to handle the backend and render the webpages.
