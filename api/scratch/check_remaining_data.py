import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import engine
from sqlalchemy import text

def check_data():
    tables = ['G5_user', 'G5_donhang', 'G5_chitietdonhang']
    for table in tables:
        print(f"\n--- Data in {table} ---")
        try:
            with engine.connect() as conn:
                result = conn.execute(text(f"SELECT * FROM {table}"))
                cols = result.keys()
                rows = result.fetchall()
                print(f"Columns: {list(cols)}")
                if not rows:
                    print("Empty table.")
                for row in rows:
                    print(row)
        except Exception as e:
            print(f"Error checking {table}: {e}")

if __name__ == "__main__":
    check_data()
