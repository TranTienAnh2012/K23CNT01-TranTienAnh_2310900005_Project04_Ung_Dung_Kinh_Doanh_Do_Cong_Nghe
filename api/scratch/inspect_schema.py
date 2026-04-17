import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import engine
from sqlalchemy import text

def inspect_schema():
    tables = ['G5_danhmuc', 'G5_sanpham', 'G5_user', 'G5_donhang', 'G5_chitietdonhang']
    for table in tables:
        print(f"\n--- Columns in {table} ---")
        try:
            with engine.connect() as conn:
                # SQL Server specific column inspection
                result = conn.execute(text(f"SELECT TOP 0 * FROM {table}"))
                print(result.keys())
        except Exception as e:
            print(f"Error inspecting {table}: {e}")

if __name__ == "__main__":
    inspect_schema()
