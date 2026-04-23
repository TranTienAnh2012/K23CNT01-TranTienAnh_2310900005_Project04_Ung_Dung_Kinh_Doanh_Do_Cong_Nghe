import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.db.connection import engine
from sqlalchemy import text

def check_all_tables():
    tables = ['G5_user', 'G5_danhmuc', 'G5_sanpham', 'G5_donhang', 'G5_chitietdonhang', 'G5_thuoctinh', 'G5_giatrithuoctinh', 'G5_danhmuc_thuoctinh']
    for table in tables:
        with engine.connect() as conn:
            try:
                print(f"Checking columns for {table}...")
                res = conn.execute(text(f"SELECT TOP 1 * FROM {table}"))
                print(f"  Columns: {list(res.keys())}")
                res.close()
            except Exception as e:
                print(f"  Error checking {table}: {e}")

if __name__ == "__main__":
    check_all_tables()
