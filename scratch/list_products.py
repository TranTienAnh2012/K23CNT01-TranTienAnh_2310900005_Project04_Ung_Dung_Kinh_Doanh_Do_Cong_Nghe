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
    print("--- G5_sanpham ---")
    res = conn.execute(text("SELECT G5_MaSanPham, G5_TenSanPham FROM G5_sanpham"))
    for row in res:
        print(f"ID={row[0]}: {repr(row[1])}")

    print("\n--- G5_sanpham_thue ---")
    res2 = conn.execute(text("SELECT G5_Id, G5_MaSanPham, G5_SoLuongChoThue FROM G5_sanpham_thue"))
    for row in res2:
        print(f"Id={row[0]}, MaSanPham={row[1]}, SoLuongChoThue={row[2]}")
