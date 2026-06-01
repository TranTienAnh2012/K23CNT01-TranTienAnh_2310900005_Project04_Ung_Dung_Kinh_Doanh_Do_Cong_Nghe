import sys
import os

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

from app.db.connection import engine
from sqlalchemy import text

with engine.connect() as conn:
    print("--- User 10 ---")
    row = conn.execute(text("SELECT G5_MaNguoiDung, G5_Email, G5_MatKhau, G5_HoTen FROM G5_user WHERE G5_MaNguoiDung = 10")).fetchone()
    if row:
        print(f"UserID={row[0]}, Email={row[1]}, PW={repr(row[2])}, Name={repr(row[3])}")
    else:
        print("User 10 not found!")
