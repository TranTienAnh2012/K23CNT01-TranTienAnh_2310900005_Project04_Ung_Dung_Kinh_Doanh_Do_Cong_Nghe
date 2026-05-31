import sys
import os

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

from app.db.connection import engine
from sqlalchemy import text

def run_migration():
    with engine.connect() as conn:
        # Check existing columns
        columns_query = text("""
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'G5_user'
        """)
        existing_cols = [row[0] for row in conn.execute(columns_query)]
        print("Existing columns:", existing_cols)

        # 1. Add G5_TenDangNhap if missing
        if 'G5_TenDangNhap' not in existing_cols:
            print("Adding G5_TenDangNhap column...")
            conn.execute(text("ALTER TABLE G5_user ADD G5_TenDangNhap NVARCHAR(100) NULL"))
            conn.commit()
            print("G5_TenDangNhap added.")
            # Populate with email prefix for existing users
            print("Populating G5_TenDangNhap with email prefixes...")
            conn.execute(text("""
                UPDATE G5_user
                SET G5_TenDangNhap = LEFT(G5_Email, CHARINDEX('@', G5_Email) - 1)
                WHERE G5_TenDangNhap IS NULL AND G5_Email LIKE '%@%'
            """))
            conn.commit()
            print("Populated.")
        else:
            print("G5_TenDangNhap already exists.")

        # 2. Add G5_GioiTinh if missing
        if 'G5_GioiTinh' not in existing_cols:
            print("Adding G5_GioiTinh column...")
            conn.execute(text("ALTER TABLE G5_user ADD G5_GioiTinh NVARCHAR(20) NULL"))
            conn.commit()
            print("G5_GioiTinh added.")
            # Set default gender for existing users to 'Male' or 'Other' or NULL.
            # Let's keep it NULL or default to 'Male' to be consistent. Let's keep it NULL for now.
        else:
            print("G5_GioiTinh already exists.")

        # 3. Refresh the view if it exists
        print("Refreshing vw_G5_User_Active view...")
        try:
            conn.execute(text("EXEC sp_refreshview 'vw_G5_User_Active'"))
            conn.commit()
            print("View refreshed.")
        except Exception as e:
            print("Failed to refresh view (maybe it doesn't exist or is not a view):", e)

if __name__ == '__main__':
    run_migration()
