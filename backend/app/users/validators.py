from email_validator import EmailNotValidError, validate_email as base_validate_email


def validate_email(email_data):
    is_valid = False
    msg = ''
    email = None
    try:
        valid = base_validate_email(email_data)
        is_valid = True
        email = valid.email

    except EmailNotValidError as exc:
        msg = str(exc)
    
    return is_valid, email, msg