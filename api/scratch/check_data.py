import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import engine
from sqlalchemy import text

def check_data():
    tables = ['G5_danhmuc', 'G5_donhang', 'G5_user']
    for table in tables:
        print(f"\n--- Data in {table} ---")
        try:
            with engine.connect() as conn:
                result = conn.execute(text(f"SELECT * FROM {table}"))
                rows = result.fetchall()
                print(f"Total rows: {len(rows)}")
                for row in rows[:2]:
                    print(row._asdict())
        except Exception as e:
            print(f"Error checking {table}: {e}")

if __name__ == "__main__":
    check_data()
