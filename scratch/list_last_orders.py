import sys
import os

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

# Force stdout to be utf-8
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

from app.db.connection import engine
from sqlalchemy import text

with engine.connect() as conn:
    print("--- Latest 5 donhang_thue ---")
    res = conn.execute(text("""
        SELECT TOP 5 G5_MaDonThue, G5_MaNguoiDung, G5_NgayBatDau, G5_NgayKetThuc, G5_TongTien, G5_HoTenNguoiNhan, G5_DiaChiNguoiNhan
        FROM G5_donhang_thue
        ORDER BY G5_MaDonThue DESC
    """))
    for row in res:
        print(f"ID={row[0]}, UserID={row[1]}, Start={row[2]}, End={row[3]}, Total={row[4]}, Name={repr(row[5])}, Address={repr(row[6])}")
