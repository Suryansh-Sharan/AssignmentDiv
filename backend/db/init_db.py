import os
import psycopg2
from dotenv import load_dotenv
load_dotenv()

try:
    conn = psycopg2.connect(
            host="localhost",
            database="sapienone",
            user=os.environ['DB_USERNAME'],
            password=os.environ['DB_PASSWORD'])

    cur = conn.cursor()

    cur.execute('DROP TABLE IF EXISTS contact;')

    create_table_sql = """
    CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(120) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    """

    
    cur.execute(create_table_sql)
    print("Table created successfully")
    conn.commit()

    cur.close()
    conn.close()
except Exception as error:
    print(error)