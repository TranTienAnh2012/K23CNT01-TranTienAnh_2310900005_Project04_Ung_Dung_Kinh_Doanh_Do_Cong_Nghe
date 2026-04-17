import sys
import os

# Add the project directory to the sys.path to import the app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import engine
from sqlalchemy import text

def test_db():
    print("Testing database connection...")
    try:
        with engine.connect() as conn:
            # Test a simple query to see if we can connect and if tables exist
            result = conn.execute(text("SELECT TOP 5 * FROM G5_donhang"))
            rows = result.fetchall()
            print(f"Connection successful! Found {len(rows)} rows in G5_donhang.")
            for row in rows:
                print(row)
    except Exception as e:
        print(f"Error connecting to database: {e}")

if __name__ == "__main__":
    test_db()
