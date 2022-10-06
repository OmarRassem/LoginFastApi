import sqlite3

con = sqlite3.connect("users.db")
cur = con.cursor()

class users():
    def __init__(self, name, password):
        self.name = name
        self.password = password

