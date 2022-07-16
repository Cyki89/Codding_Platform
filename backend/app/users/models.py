import uuid
from cassandra.cqlengine import columns
from cassandra.cqlengine.models import Model

from config import get_settings
settings = get_settings()

from . import validators
from . import security


class User(Model):
    __keyspace__ = settings.keyspace
    email = columns.Text(primary_key=True)
    user_id = columns.UUID(primary_key=True, index=True, default=uuid.uuid1)
    rank_points = columns.Integer(default=0)
    role = columns.TinyInt(default=0)
    password = columns.Text(required=True)

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"User(email={self.email}, user_id={self.user_id})"

    def set_password(self, password, commit=False):
        password_hash = security.generate_hash(password)
        self.password = password_hash
        if commit:
            self.save()

    def verify_password(self, password):
        password_hash = self.password
        verified, _ = security.verify_hash(password, password_hash)
        
        return verified
    
    @staticmethod
    def create_user(email, password=None):
        q = User.objects.filter(email=email)
        if q.count() != 0:
            raise Exception("User already has account.")

        is_valid, valid_email, exc = validators.validate_email(email)
        if not is_valid:
            raise Exception(f'Invalid email {exc}')

        obj = User(email=valid_email)
        obj.set_password(password)
        obj.save()
        
        return obj