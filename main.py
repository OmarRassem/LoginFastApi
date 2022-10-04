from fastapi import FastAPI
from starlette.responses import FileResponse 

app = FastAPI()

@app.get("/")
async def read_index():
    return FileResponse('assets/html/home.html')

@app.get("/login")
async def read_index():
    return FileResponse('assets/html/login.html')

@app.get("/user_home")
async def read_index():
    return FileResponse('assets/html/user_home.html')

class users():
    def __init__(self, name, password):
        self.name = name
        self.password = password

