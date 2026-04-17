import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import engine
from sqlalchemy import text

def inspect_all():
    print("--- Inspecting Products ---")
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT G5_MaSanPham, G5_TenSanPham, G5_HinhAnh, G5_IsDeleted FROM G5_sanpham"))
            for row in result:
                print(f"ID: {row.G5_MaSanPham}, Name: {row.G5_TenSanPham}, Image: {row.G5_HinhAnh}, Deleted: {row.G5_IsDeleted}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_all()
