import os
from dotenv import load_dotenv # Thư viện để load các biến môi trường từ file .env

# Load các cấu hình từ file .env vào bộ nhớ hệ thống
load_dotenv()

# --- CẤU HÌNH HỆ THỐNG ---
SECRET_KEY = os.getenv("SECRET_KEY", "default-key") # Khóa bảo mật của ứng dụng

# --- CẤU HÌNH DATABASE SQL SERVER ---
DB_SERVER = os.getenv("DB_SERVER", "localhost") # Tên server hoặc địa chỉ IP
DB_NAME = os.getenv("DB_NAME", "G5_KD_DO_CONG_NGHE") # Tên cơ sở dữ liệu chính
DB_USER = os.getenv("DB_USER") # Tài khoản đăng nhập SQL (nếu có)
DB_PASS = os.getenv("DB_PASS") # Mật khẩu đăng nhập SQL (nếu có)

# Tự động xác định kiểu kết nối: 
# Nếu không có user/pass thì dùng Windows Authentication (yes), ngược lại dùng SQL Auth (no)
DB_TRUSTED = "yes" if not DB_USER else "no"

