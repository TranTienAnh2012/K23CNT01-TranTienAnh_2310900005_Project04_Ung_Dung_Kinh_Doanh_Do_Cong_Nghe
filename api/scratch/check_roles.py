import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import engine
from sqlalchemy import text

def check_admin():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT G5_Email, G5_VaiTro FROM G5_user"))
            for row in result:
                print(f"Email: {row.G5_Email}, Role: {row.G5_VaiTro}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_admin()
