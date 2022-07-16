import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from cassandra.cqlengine.management import sync_table

import db
import config

from users import models as user_models, router as user_router
from questions import models as question_models, router as question_router
from python import router as python_router


app = FastAPI()
settings = config.get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
COOKIE_EXPIRE_TIME = settings.cookie_expire_time
DB_SESSION = None


origins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"], 
    allow_headers=["Access-Control-Allow-Headers", 'Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
)

@app.on_event("startup")
def on_startup():
    global DB_SESSION
    DB_SESSION = db.get_session()
    sync_table(user_models.User)
    sync_table(question_models.Question)
    sync_table(question_models.QuestionSubmission)


app.include_router(user_router.router)
app.include_router(question_router.router)
app.include_router(python_router.router)


@app.get('/')
def homepage():
    return {}


if __name__ == "__main__":
    uvicorn.run(app='main:app', host="127.0.0.1", port=8000, reload=False)