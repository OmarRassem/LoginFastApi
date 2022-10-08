import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from starlette.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from passlib.hash import bcrypt
from tortoise.contrib.fastapi import register_tortoise
import uvicorn
from model import User, oauth2_scheme, userIn_pydantic, user_pydantic, userOut_pydantic

# JWT secret for token creation
JWT_SECRET = "s3m8SkZCjwzkDk25slNLMMFQ4y1XQHG3EcfBZuKPnLVOLy7hkBffKYRA3BET4E4"
ALGORITHM = "HS256"

app = FastAPI()

# mounting static folder from (/assets)
app.mount("/assets", StaticFiles(directory="assets"), name="assets")

# index file url
HOME_INDEX = "assets/index.html"


# serving a single index html file 


@app.get("/", tags=['login'])
async def read_index():
    return FileResponse(HOME_INDEX)


@app.get("/login", tags=['login'])
async def read_index():
    return FileResponse(HOME_INDEX)


@app.get("/user_home", tags=['login'])
async def read_index():
    return FileResponse(HOME_INDEX)


# user details authenticator
async def auth_user(username: str, password: str):
    user = await User.get(username=username)
    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user


# get current loggedin user based on Token
async def get_curr_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user = await User.get(id=payload.get("id"))

    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid username or password",
        )

    return await user_pydantic.from_tortoise_orm(user)


# token generator on each login
@app.post("/token", tags=["tokens"])
async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):

    # authenticate user details
    user = await auth_user(form_data.username, form_data.password)

    # test for user
    if not user:
        return {"error": "invalid credentials"}

    # user.set_active()
    await user.filter(id=user.id).update(is_active=True)

    # conv user model to pydantic
    user_obj = await user_pydantic.from_tortoise_orm(user)

    # encode user obj into JWT token using the JWT Secret
    token = jwt.encode(user_obj.dict(exclude={"password_hash"}), JWT_SECRET)

    # return token with type
    return {"access_token": token, "token_type": "bearer"}


# Backend point to create users for testing the login function
@app.post("/users", response_model=user_pydantic, tags=["users"])
async def create_user(users: userIn_pydantic):
    user_obj = User(
        username=users.username, password_hash=bcrypt.hash(users.password_hash)
    )
    await user_obj.save()
    return await user_pydantic.from_tortoise_orm(user_obj)


# user home route returning user obj
@app.get("/whoami", response_model=userOut_pydantic, tags=["users"])
async def get_user(user: user_pydantic = Depends(get_curr_user)):
    return user.dict(include={"username"})

# logmeout route to update db when user logs out
@app.get("/logmeout", tags=['login'])
async def log_out(user: user_pydantic = Depends(get_curr_user)):
    await User.filter(id=user.id).update(is_active=False)
    return user.dict(include={"username", "is_active"})


# registering the db
register_tortoise(
    app,
    db_url="sqlite://db.sqlite",
    modules={"modules": ["main"]},
    generate_schemas=True,
    add_exception_handlers=True,
)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", reload=True)
