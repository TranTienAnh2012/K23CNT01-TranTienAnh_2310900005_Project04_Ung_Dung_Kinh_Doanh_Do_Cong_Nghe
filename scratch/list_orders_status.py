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
    print("--- Listing G5_donhang statuses ---")
    res = conn.execute(text("SELECT G5_MaDonHang, G5_TrangThai, G5_TrangThaiThanhToan, G5_PhuongThucThanhToan FROM G5_donhang"))
    for row in res:
        print(f"MaDonHang={row[0]}, TrangThai={row[1]}, TrangThaiThanhToan={row[2]}, PhuongThucThanhToan={row[3]}")
