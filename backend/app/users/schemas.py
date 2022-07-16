from pydantic import (
    BaseModel, 
    EmailStr, 
    SecretStr,
    UUID1,
    validator,
)

from .models import User


class UserSignupSchema(BaseModel):
    email: EmailStr
    password: SecretStr
    password_confirm: SecretStr
        
    @validator("email")
    def email_available(cls, v, values, **kwargs):
        q = User.objects.filter(email=v)
        if q.count() != 0:
            raise ValueError("Email is not available")
        return v
        
    @validator("password_confirm")
    def passwords_match(cls, v, values, **kwargs):
        password = values.get('password')
        password_confirm = v
        if password != password_confirm:
            raise ValueError("Passwords do not match")
        return v


class UserLoginSchema(BaseModel):
    email: str
    password: str


class UserResponseSchema(BaseModel):
    email: EmailStr
    user_id: UUID1
    rank_points: int
    role: int


class AccessTokenSchema(BaseModel):
    access_token: str
    token_type: str 


class RefreshTokenSchema(BaseModel):
    refresh_token: str
    token_type: str