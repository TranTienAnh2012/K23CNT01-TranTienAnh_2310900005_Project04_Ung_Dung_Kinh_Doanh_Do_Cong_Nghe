"""Script kiểm tra kết nối SQL Server"""
import pyodbc
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

DB_SERVER = os.getenv("DB_SERVER", "localhost")
DB_NAME = os.getenv("DB_NAME", "G5_KD_DO_CONG_NGHE")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

print(f"=== Kiem tra ket noi SQL Server ===")
print(f"Server : {DB_SERVER}")
print(f"Database: {DB_NAME}")
print(f"Auth    : {'SQL Server Auth' if DB_USER else 'Windows Auth (Trusted Connection)'}")
print()

# Liệt kê ODBC drivers có sẵn
drivers = pyodbc.drivers()
print(f"ODBC Drivers co san:")
for d in drivers:
    print(f"  - {d}")
print()

# Thử kết nối
try:
    if DB_USER and DB_PASS:
        conn_str = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={DB_SERVER};"
            f"DATABASE={DB_NAME};"
            f"UID={DB_USER};"
            f"PWD={DB_PASS}"
        )
    else:
        conn_str = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={DB_SERVER};"
            f"DATABASE={DB_NAME};"
            f"Trusted_Connection=yes"
        )

    print(f"Dang ket noi...")
    conn = pyodbc.connect(conn_str, timeout=10)
    cursor = conn.cursor()

    # Test query
    cursor.execute("SELECT @@VERSION")
    row = cursor.fetchone()
    print(f"[OK] Ket noi thanh cong!")
    print(f"SQL Server version: {row[0][:80]}...")
    print()

    # Liệt kê các bảng
    cursor.execute("""
        SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME
    """)
    tables = cursor.fetchall()
    print(f"Cac bang trong database '{DB_NAME}':")
    for t in tables:
        print(f"  - {t[0]}")

    cursor.close()
    conn.close()
    print(f"\n[OK] Ket noi database THANH CONG!")

except pyodbc.Error as e:
    print(f"\n[LOI] Khong the ket noi database!")
    print(f"Chi tiet loi: {e}")
    print()
    print("Goi y:")
    print("  1. Kiem tra SQL Server dang chay (SQL Server Configuration Manager)")
    print("  2. Kiem tra ten server trong file .env (DB_SERVER)")
    print("  3. Dam bao ODBC Driver 17 for SQL Server da cai dat")
    print("  4. Kiem tra ten database (DB_NAME) dung chua")
