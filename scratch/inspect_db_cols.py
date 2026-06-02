import sys
import os

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

from app.db.connection import engine
from sqlalchemy import text

with engine.connect() as conn:
    query = text("""
        SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'G5_user'
    """)
    res = conn.execute(query)
    print("Column details for G5_user:")
    for row in res:
        print(f"- {row[0]}: {row[1]} (length={row[2]}, nullable={row[3]})")
