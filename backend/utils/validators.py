import re

email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
phone_regex = r"^[0-9]{10}$"

def validate_contact(name, email, phone):
    if not name or not email or not phone:
        return "Missing required fields"

    if not re.match(email_regex, email):
        return "Invalid email"

    if not re.match(phone_regex, phone):
        return "Invalid phone number"

    return None
