import sys
import os

# Add the api directory to sys.path to import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.connection import engine
from sqlalchemy import text

def test_connection():
    print("Testing database connection...")
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("Connection successful!")
            print(f"Result: {result.fetchone()}")
    except Exception as e:
        print("Connection failed!")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")

if __name__ == "__main__":
    test_connection()
