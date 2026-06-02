import sys
import os

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

from app.db.connection import engine
from sqlalchemy import text

tables = ['G5_sanpham_thue', 'G5_donhang_thue', 'G5_chitiet_donhang_thue', 'G5_lich_su_thue']

with engine.connect() as conn:
    for table in tables:
        query = text(f"""
            SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = '{table}'
        """)
        res = conn.execute(query)
        print(f"\nColumn details for {table}:")
        for row in res:
            print(f"- {row[0]}: {row[1]} (length={row[2]}, nullable={row[3]})")
