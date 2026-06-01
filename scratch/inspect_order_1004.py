import sys
import os

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

from app.db.connection import engine
from sqlalchemy import text

with engine.connect() as conn:
    print("--- Order 1004 ---")
    row = conn.execute(text("SELECT G5_MaDonHang, G5_TrangThai, G5_TrangThaiThanhToan, G5_PhuongThucThanhToan FROM G5_donhang WHERE G5_MaDonHang = 1004")).fetchone()
    if row:
        print(f"MaDonHang={row[0]}, TrangThai={repr(row[1])}, TrangThaiThanhToan={repr(row[2])}, PhuongThucThanhToan={repr(row[3])}")
    else:
        print("Order 1004 not found!")
