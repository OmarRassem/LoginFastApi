from fastapi import FastAPI
from tortoise.contrib.pydantic import pydantic_model_creator
from starlette.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from passlib.hash import bcrypt
from tortoise import fields
from tortoise.models import Model
from tortoise.contrib.fastapi import register_tortoise
import uvicorn


app = FastAPI()

app.mount("/assets", StaticFiles(directory="assets"), name="assets")


@app.get("/")
async def read_index():
    return FileResponse("assets/index.html")


@app.get("/whoami")
async def auth():

    return {"token": "Welcome"}


@app.get("/login")
async def read_index():
    return {"HI": "U"}


# Model
class user(Model):
    id = fields.IntField(pk = True)
    username = fields.CharField(50, unique=True)
    password_hash = fields.CharField(128)

    @classmethod
    async def get_user(cls, username):
        return cls.get(username = username)

    def verify_password(self, password):
        return bcrypt.verify(password, self.password_hash)

user_pydantic = pydantic_model_creator(user, name='User')
userIn_pydantic = pydantic_model_creator(user, name='UserIn', exclude_readonly= True)

@app.post('/users', response_model= user_pydantic)
async def create_user(users: userIn_pydantic):
    user_obj = user(username= users.username, password_hash = bcrypt.hash(users.password_hash))
    await user_obj.save()
    return await user_pydantic.from_tortoise_orm(user_obj)

register_tortoise(
    app,
    db_url="sqlite://db.sqlite",
    modules={"modules": ["main"]},
    generate_schemas=True,
    add_exception_handlers=True,
)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", reload=True)
