from datetime import datetime, timedelta

from jose import JWTError, jwt
from fastapi import HTTPException, status

from users.models import User
from users.utils import get_user
import users.security as security
import config

settings = config.get_settings()
ALGORITHM = settings.jwt_algorithm
SECRET_KEY = settings.secret_key
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes
REFRESH_TOKEN_EXPIRE_HOURS = settings.refresh_token_expire_hours


UNAUTHORIZED_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Incorrect email or password",
    headers={"WWW-Authenticate": "Bearer"},
)


def encode_token(user_id, email, role, rank_points, scope, exp_time):
        payload = {
            'exp' : datetime.utcnow() + exp_time,
            'iat' : datetime.utcnow(),
            'scope': scope,
            'user_id': str(user_id)
        }

        if scope == 'access_token':
           payload.update({ 
            'email' : email,
            'rank_points': rank_points,
            'role': role
        }) 

        return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def encode_access_token(user_id, email, role, rank_points):
    return encode_token(
        user_id=str(user_id),
        email=email,
        role=role,
        rank_points=rank_points,
        scope='access_token',
        exp_time=timedelta(days=0, minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )


def encode_refresh_token(user_id):
    return encode_token(
        user_id=str(user_id),
        email=None,
        role=None,
        rank_points=None,
        scope='refresh_token',
        exp_time=timedelta(days=0, hours=REFRESH_TOKEN_EXPIRE_HOURS)
    )


def decode_token(token, scope):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        if (payload['scope'] != scope):
            raise HTTPException(status_code=401, detail='Scope for the token is invalid')
        return payload       
    except JWTError as exc:
        raise HTTPException(status_code=401, detail=str(exc))


def decode_access_token(access_token):
    return decode_token(access_token, 'access_token')


def decode_refresh_token(refresh_token):
    return decode_token(refresh_token, 'refresh_token')


def refresh_access_token(refresh_token): 
    if not refresh_token:
        raise UNAUTHORIZED_EXCEPTION 
    
    token = decode_refresh_token(refresh_token)
    user = User.objects.get(user_id=token['user_id'])
    return encode_access_token(
        user.user_id, user.email, user.role, user.rank_points
    )


def authenticate_user(email: str, password: str):
    user = get_user(email)
    if not user:
        raise UNAUTHORIZED_EXCEPTION
    
    verified, _ = security.verify_hash(password, user.password)
    
    if not verified:
        raise UNAUTHORIZED_EXCEPTION
    return user


