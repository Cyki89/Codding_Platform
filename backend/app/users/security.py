from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError


def generate_hash(raw_password):
    ph = PasswordHasher()
    return ph.hash(raw_password)


def verify_hash(password, hash_password):
    ph = PasswordHasher()
    msg =''
    verified = False
    
    try:
        verified = ph.verify(hash_password, password)
    except VerifyMismatchError:
        msg = 'Invalid Password'
    except Exception as exc:
        msg = f'Unexpected Error: {exc}'
    
    return verified, msg