import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import engine
from sqlalchemy import text

def undelete():
    query = "UPDATE G5_sanpham SET G5_IsDeleted = 0 WHERE G5_MaSanPham = 1"
    try:
        with engine.connect() as conn:
            conn.execute(text(query))
            conn.commit()
            print("Successfully undeleted Xiaomi POCO X7 Pro (ID: 1)")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    undelete()
