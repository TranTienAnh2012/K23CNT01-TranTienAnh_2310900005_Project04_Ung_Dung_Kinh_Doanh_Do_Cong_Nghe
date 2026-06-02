import sys
import os

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

from app.db.connection import engine
from sqlalchemy import text

with engine.connect() as conn:
    print("--- Inspecting nhanvien@g5store.vn ---")
    row = conn.execute(text("SELECT G5_MaNguoiDung, G5_Email, G5_HoTen, G5_VaiTro, G5_IsDeleted FROM G5_user WHERE G5_Email = 'nhanvien@g5store.vn'")).fetchone()
    if row:
        print(f"UserID={row[0]}, Email={row[1]}, HoTen={row[2]}, VaiTro={repr(row[3])}, IsDeleted={row[4]}")
    else:
        print("User not found!")
