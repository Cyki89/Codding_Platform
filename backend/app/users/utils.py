from .models import User

def get_user(email: str):
    query = User.objects.filter(email=email)
    return query and query.first()
