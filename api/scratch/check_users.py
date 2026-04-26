import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.db.connection import engine
from sqlalchemy import text

with engine.connect() as conn:
    res = conn.execute(text("SELECT G5_Email, G5_MatKhau, G5_VaiTro FROM G5_user"))
    for row in res:
        print(f"User: {row[0]}, Pass: {row[1]}, Role: {row[2]}")
