import os
from pydantic import BaseSettings, Field
from functools import lru_cache
from pathlib import Path

os.environ['CQLENG_ALLOW_SCHEMA_MANAGEMENT'] = '1'

class Settings(BaseSettings):
    base_dir: Path = Path(__file__).resolve().parent
    keyspace: str = Field(..., env='ASTRADB_KEYSPACE')
    db_client_id: str = Field(..., env='ASTRADB_CLIENT_ID')
    db_client_secret: str = Field(..., env='ASTRADB_CLIENT_SECRET')
    secret_key: str = Field(..., env='SECRET_KEY')
    jwt_algorithm: str = Field(default='HS256')
    access_token_expire_minutes: int = Field(default=30)
    refresh_token_expire_hours: int = Field(default=20)
    cookie_expire_time  = 24 * 3600

    class Config:
        env_file = '../.env'


@lru_cache()
def get_settings():
    return Settings()