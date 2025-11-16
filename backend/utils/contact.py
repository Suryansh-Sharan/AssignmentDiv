from db.connection import get_connection
from db.queries import CREATE_CONTACT, GET_ALL_CONTACTS, GET_CONTACT, UPDATE_CONTACT,SEARCH_CONTACTS
from utils.validators import validate_contact
from psycopg2 import IntegrityError
from utils.generator import generate_unique_id


def create_contact(data):
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")

    error = validate_contact(name, email, phone)
    if error:
        return None, error

    try:
        conn = get_connection()
        cur = conn.cursor()
        new_id = generate_unique_id()
        cur.execute(CREATE_CONTACT, (new_id, name, email, phone))
        conn.commit()
        return new_id, None
    except IntegrityError:
        return None, "Email already exists"
    finally:
        cur.close()
        conn.close()


def search_contacts(name):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(SEARCH_CONTACTS, (f'%{name}%',))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def list_contacts():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(GET_ALL_CONTACTS)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


def get_contact(id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(GET_CONTACT, (id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row


def update_contact(id, data):
    conn = get_connection()
    cur = conn.cursor()

    name = data.get("name") or None
    email = data.get("email") or None
    phone = data.get("phone") or None

    if not name and not email and not phone:
        return [],None, "Missing required fields"
    
    try:
        cur.execute(UPDATE_CONTACT, (name, email, phone, id))
        row = cur.fetchone()
        conn.commit()
        return row,(row is not None), None
    except IntegrityError:
        return [],None, "Email already exists"
    finally:
        cur.close()
        conn.close()
