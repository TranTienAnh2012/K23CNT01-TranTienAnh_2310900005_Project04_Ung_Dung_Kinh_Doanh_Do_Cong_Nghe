import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.db.connection import engine
from sqlalchemy import text

with engine.connect() as conn:
    res = conn.execute(text("SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'G5_user' AND COLUMN_NAME = 'G5_MatKhau'"))
    row = res.fetchone()
    if row:
        print(f"Col: {row[0]}, Type: {row[1]}, Len: {row[2]}")
