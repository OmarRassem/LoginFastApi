from fastapi import FastAPI
from starlette.responses import FileResponse 
from fastapi.staticfiles import StaticFiles
import uvicorn


app = FastAPI()

app.mount("/assets", StaticFiles(directory="assets"), name="assets")


@app.get("/")
async def read_index():
    return FileResponse('assets/index.html')

@app.get("/whoami")
async def auth():

    return {"token" : "Welcome"}

@app.get("/login")
async def read_index():
    return {"HI" : "U"}

""" @app.get("/user_home")
async def read_index():
    return FileResponse('assets/user_home.html') """



if __name__ == "__main__":
    uvicorn.run("main:app", host = "127.0.0.1", reload=True)

