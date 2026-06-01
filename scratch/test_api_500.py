import sys
import os
import requests
from flask import Flask
from flask_jwt_extended import JWTManager, create_access_token

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

from app.db.connection import engine
from sqlalchemy import text
from app.core.config import get_config

# Find admin user ID
with engine.connect() as conn:
    row = conn.execute(text("SELECT G5_MaNguoiDung, G5_Email, G5_HoTen, G5_VaiTro FROM G5_user WHERE G5_VaiTro = 'admin'")).fetchone()
    if row:
        admin_id = row[0]
        admin_email = row[1]
        admin_name = row[2]
        print(f"Found Admin: ID={admin_id}, Email={admin_email}, Name={admin_name}")
    else:
        print("No admin user found! Checking any user...")
        row = conn.execute(text("SELECT G5_MaNguoiDung, G5_Email, G5_HoTen, G5_VaiTro FROM G5_user")).fetchone()
        admin_id = row[0]
        admin_email = row[1]
        admin_name = row[2]
        print(f"Using fallback user: ID={admin_id}, Email={admin_email}, Name={admin_name}")

# Create a temporary Flask app to generate the token
app = Flask(__name__)
config = get_config()
app.config["JWT_SECRET_KEY"] = config.JWT_SECRET_KEY or "store-secret-key-tta-2026-high-security-key-32chars"
jwt = JWTManager(app)

with app.app_context():
    token = create_access_token(
        identity=str(admin_id),
        additional_claims={
            "email": admin_email,
            "vai_tro": "admin",
            "name": admin_name
        }
    )

headers = {
    "Authorization": f"Bearer {token}"
}

# Request /api/tta_sanpham_thue
url = "http://127.0.0.1:5000/api/tta_donhang_thue"
print(f"Fetching {url}...")
res = requests.get(url, headers=headers)
print("Status Code:", res.status_code)
print("Response text:")
print(res.text[:3000])
