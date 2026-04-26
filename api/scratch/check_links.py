import sys
import os
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.path.append(os.path.join(os.getcwd(), 'api'))

from app.db.connection import engine
from sqlalchemy import text

def check_links():
    with engine.connect() as connection:
        result = connection.execute(text("""
            SELECT dt.G5_Id, dm.G5_TenDanhMuc, tt.G5_TenThuocTinh 
            FROM G5_danhmuc_thuoctinh dt
            JOIN G5_danhmuc dm ON dt.G5_MaDanhMuc = dm.G5_MaDanhMuc
            JOIN G5_thuoctinh tt ON dt.G5_ThuocTinhID = tt.G5_ThuocTinhID
        """))
        for row in result:
            print(f"ID: {row[0]}, Category: {row[1]}, Attribute: {row[2]}")

if __name__ == "__main__":
    check_links()
