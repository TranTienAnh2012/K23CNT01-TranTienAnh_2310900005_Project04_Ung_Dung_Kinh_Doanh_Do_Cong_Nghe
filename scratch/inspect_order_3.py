import sys
import os

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

from app.db.connection import engine
from sqlalchemy import text

with engine.connect() as conn:
    print("--- Order 3 ---")
    row = conn.execute(text("SELECT G5_MaDonHang, G5_MaNguoiDung, G5_TrangThai FROM G5_donhang WHERE G5_MaDonHang = 3")).fetchone()
    if row:
        print(f"MaDonHang={row[0]}, MaNguoiDung={row[1]}, TrangThai={row[2]}")
        # Find user email
        user_row = conn.execute(text(f"SELECT G5_Email FROM G5_user WHERE G5_MaNguoiDung = {row[1]}")).fetchone()
        if user_row:
            print(f"User email: {user_row[0]}")
    else:
        print("Order 3 not found!")
