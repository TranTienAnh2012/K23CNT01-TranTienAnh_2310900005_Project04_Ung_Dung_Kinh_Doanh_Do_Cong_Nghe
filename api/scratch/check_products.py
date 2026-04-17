import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import engine
from sqlalchemy import text

def check_products():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT G5_TenSanPham, G5_HinhAnh FROM G5_sanpham"))
            for row in result:
                print(f"Product: {row.G5_TenSanPham}, Image: {row.G5_HinhAnh}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_products()
