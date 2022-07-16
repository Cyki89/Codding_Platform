from fastapi import APIRouter, Cookie, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
import uuid

import config
from users import schemas as user_schemas, auth
from users.models import User

router = APIRouter(tags=['users'])
settings = config.get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
COOKIE_EXPIRE_TIME = settings.cookie_expire_time


@router.get("/users", response_model=list[user_schemas.UserResponseSchema])
def get_user_list():
    users = User.objects.all()
    
    return list(users)


@router.post(
    "/signup", 
    response_model=user_schemas.UserResponseSchema, 
    status_code=status.HTTP_201_CREATED
)
def singup(data: user_schemas.UserSignupSchema):
    user = User.create_user(email=data.email, password=data.password.get_secret_value())
    
    return user


@router.post("/login", response_model=user_schemas.AccessTokenSchema)
def login(credentials: user_schemas.UserLoginSchema):
    user = auth.authenticate_user(credentials.email, credentials.password)    

    access_token = auth.encode_access_token(
        user.user_id, user.email, user.role, user.rank_points
    )
    refresh_token = auth.encode_refresh_token(user.user_id)

    response = JSONResponse(content={'access_token': access_token, 'token_type': 'bearer'})
    response.set_cookie(
        key="refresh_token", 
        value=refresh_token,
        httponly=True,
        max_age=COOKIE_EXPIRE_TIME)
    
    return response


@router.post('/logout')
def logout():
    response = JSONResponse({}, status.HTTP_200_OK)
    response.delete_cookie(key='refresh_token')

    return response


@router.post('/jwt/refresh', response_model=user_schemas.AccessTokenSchema)
def refresh_token(refresh_token: str | None = Cookie(default=None)):
    return {'access_token': auth.refresh_access_token(refresh_token), 'token_type': 'bearer'}
