import random
from db.connection import get_connection

def generate_unique_id():
    while True:
        new_id = random.randint(100000, 999999)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT id FROM contacts WHERE id = %s;", (new_id,))
        exists = cur.fetchone()

        cur.close()
        conn.close()

        if not exists:
            return new_id
    