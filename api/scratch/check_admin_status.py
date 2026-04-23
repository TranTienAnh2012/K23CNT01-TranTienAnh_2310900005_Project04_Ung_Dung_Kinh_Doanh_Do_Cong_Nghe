import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.db.connection import engine
from sqlalchemy import text

with engine.connect() as conn:
    res = conn.execute(text("SELECT G5_Email, G5_IsDeleted, G5_VaiTro FROM G5_user WHERE G5_Email = 'admin@g5store.vn'"))
    row = res.fetchone()
    if row:
        print(f"Email: {row[0]}, IsDeleted: {row[1]}, Role: {row[2]}")
    else:
        print("User not found")
