import os
from sqlalchemy import create_engine # Thư viện tạo kết nối database
from sqlalchemy.ext.declarative import declarative_base # Lớp cơ sở cho các models
from sqlalchemy.orm import sessionmaker # Tạo phiên làm việc (session) với DB
from app.core.config import DB_SERVER, DB_NAME, DB_TRUSTED, DB_USER, DB_PASS
from urllib.parse import quote_plus # Xử lý ký tự đặc biệt trong chuỗi kết nối


# --- XÂY DỰNG CHUỖI KẾT NỐI (CONNECTION STRING) ---
if DB_USER and DB_PASS:
    # Trường hợp 1: Sử dụng tài khoản SQL Server (Username/Password)
    params = quote_plus(
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={DB_SERVER};"
        f"DATABASE={DB_NAME};"
        f"UID={DB_USER};"
        f"PWD={DB_PASS}"
    )
else:
    # Trường hợp 2: Sử dụng xác thực Windows (Trusted Connection)
    params = quote_plus(
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={DB_SERVER};"
        f"DATABASE={DB_NAME};"
        f"Trusted_Connection=yes"
    )

# Chuỗi kết nối hoàn chỉnh sử dụng driver pyodbc
SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"

# Khởi tạo Engine (Bộ máy thực thi SQL)
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Khởi tạo SessionLocal (Để thực hiện các truy vấn trong ứng dụng)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Lớp cơ sở để các Models kế thừa
Base = declarative_base()

