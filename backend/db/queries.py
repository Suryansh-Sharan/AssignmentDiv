CREATE_CONTACT = """
INSERT INTO contacts (id,name,email,phone)
VALUES (%s,%s,%s,%s)
RETURNING id;
"""

GET_ALL_CONTACTS = "SELECT * FROM contacts ORDER BY id ASC;"

SEARCH_CONTACTS = """
SELECT * FROM contacts
WHERE name ILIKE %s
ORDER BY id ASC;
"""

GET_CONTACT = "SELECT * FROM contacts WHERE id = %s;"

UPDATE_CONTACT = """
UPDATE contacts
SET name = COALESCE(%s, name),
    email = COALESCE(%s, email),
    phone = COALESCE(%s, phone)
WHERE id = %s
RETURNING *;
"""
