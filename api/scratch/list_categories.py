import sys
import os
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.path.append(os.path.join(os.getcwd(), 'api'))

from app.db.connection import engine
from sqlalchemy import text

def list_categories():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT G5_MaDanhMuc, G5_TenDanhMuc FROM G5_danhmuc"))
        for row in result:
            print(f"ID: {row[0]}, Name: {row[1]}")

if __name__ == "__main__":
    list_categories()
