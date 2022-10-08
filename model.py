from tortoise import fields
from tortoise.models import Model
from passlib.hash import bcrypt
from tortoise.contrib.pydantic import pydantic_model_creator
from fastapi.security import OAuth2PasswordBearer

# User Model based on tortoise models
class User(Model):
    id = fields.IntField(pk=True) #primary key
    username = fields.CharField(50, unique=True) #unique username
    password_hash = fields.CharField(128)
    is_active = fields.BooleanField(default=False)

    #pass verify method
    def verify_password(self, password):
        return bcrypt.verify(password, self.password_hash)



# conv User model into pydantic for validation
user_pydantic = pydantic_model_creator(User, name="User")
userIn_pydantic = pydantic_model_creator(User, name="UserIn", exclude_readonly=True)
userOut_pydantic = pydantic_model_creator(User, name="UserOut", include={"username"})

# create an instance of the OAuth scheme with bearer type
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
