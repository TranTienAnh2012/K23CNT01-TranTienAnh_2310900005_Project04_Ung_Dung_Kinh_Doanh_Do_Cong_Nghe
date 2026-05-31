import sys
import os

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

from app.db.connection import engine
from sqlalchemy import text

def run():
    with engine.connect() as conn:
        print("Checking if G5_GhiChu column exists in G5_donhang_thue...")
        check_query = text("""
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'G5_donhang_thue' AND COLUMN_NAME = 'G5_GhiChu'
        """)
        exists = conn.execute(check_query).fetchone()
        if not exists:
            print("Adding G5_GhiChu column to G5_donhang_thue...")
            conn.execute(text("ALTER TABLE G5_donhang_thue ADD G5_GhiChu NVARCHAR(MAX) NULL"))
            conn.commit()
            print("G5_GhiChu added successfully.")
        else:
            print("G5_GhiChu column already exists.")

if __name__ == '__main__':
    run()
