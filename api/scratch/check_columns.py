import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.db.connection import engine
from sqlalchemy import text

def check_columns():
    with engine.connect() as conn:
        try:
            print("Checking columns for G5_danhmuc...")
            res = conn.execute(text("SELECT TOP 1 * FROM G5_danhmuc"))
            print(f"Columns: {res.keys()}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    check_columns()
