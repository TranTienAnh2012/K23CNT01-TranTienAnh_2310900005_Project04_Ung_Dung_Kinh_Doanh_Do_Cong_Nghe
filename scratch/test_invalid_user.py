import sys
import os
import requests

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

from flask import Flask
from flask_jwt_extended import JWTManager, create_access_token
from app.core.config import get_config

# Create a temporary Flask app to generate the token
app = Flask(__name__)
config = get_config()
app.config["JWT_SECRET_KEY"] = config.JWT_SECRET_KEY or "store-secret-key-tta-2026-high-security-key-32chars"
jwt = JWTManager(app)

with app.app_context():
    # Let's generate a token for a non-existent user ID like 999
    token = create_access_token(
        identity="999",
        additional_claims={
            "email": "nonexistent@test.com",
            "vai_tro": "khachhang",
            "name": "Non Existent User"
        }
    )

# Now, make a POST request to localhost:5000
rent_url = "http://127.0.0.1:5000/api/client/tta_donhang_thue"
rent_payload = {
    'G5_NgayBatDau': '2026-05-31T08:00:00',
    'G5_NgayKetThuc': '2026-06-01T18:00:00',
    'G5_TongTien': 300000.0,
    'G5_TienCoc': 100000.0,
    'HoTenNguoiNhan': 'Tran Tien Anh',
    'SoDienThoaiNguoiNhan': '0345862097',
    'DiaChiNguoiNhan': 'Phú Lãm- Hà Đông - Hà Nội, Phường Phú Lãm, Quận Hà Đông, Thành phố Hà Nội',
    'EmailNguoiNhan': 'tienanhtran777@gmail.com',
    'GhiChu': 'Gọi cho tôi khi giao đến',
    'items': [
        {
            'G5_MaSanPham': 15,
            'G5_SoLuong': 1,
            'G5_GiaThue': 300000.0
        }
    ]
}

headers = {
    "Authorization": f"Bearer {token}"
}

print(f"Posting rental request to {rent_url} with user_id=999...")
r_rent = requests.post(rent_url, json=rent_payload, headers=headers)
print(f"Status code: {r_rent.status_code}")
print("Response text:")
print(r_rent.text)
