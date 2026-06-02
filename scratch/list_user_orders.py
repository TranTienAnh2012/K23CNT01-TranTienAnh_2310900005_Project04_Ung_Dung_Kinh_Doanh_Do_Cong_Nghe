import sys
import os

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

from app.db.connection import engine
from sqlalchemy import text

with engine.connect() as conn:
    print("--- Listing orders of User 1 ---")
    res = conn.execute(text("SELECT G5_MaDonHang, G5_MaNguoiDung, G5_TrangThai, G5_TongTien FROM G5_donhang WHERE G5_MaNguoiDung = 1"))
    for row in res:
        print(f"MaDonHang={row[0]}, MaNguoiDung={row[1]}, TrangThai={row[2]}, TongTien={row[3]}")
