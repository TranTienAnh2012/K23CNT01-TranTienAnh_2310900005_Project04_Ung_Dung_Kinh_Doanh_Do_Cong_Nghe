import sys
import os

# Add the api directory to sys.path to import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.connection import engine
from app.models.schema import danhmuc
from sqlalchemy import select

def test_query():
    print("Testing G5_danhmuc query...")
    try:
        stmt = select(danhmuc)
        with engine.connect() as conn:
            result = conn.execute(stmt)
            print("Query successful!")
            rows = result.fetchall()
            print(f"Found {len(rows)} rows.")
            for row in rows:
                print(row._mapping)
    except Exception as e:
        print("Query failed!")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")

if __name__ == "__main__":
    test_query()
