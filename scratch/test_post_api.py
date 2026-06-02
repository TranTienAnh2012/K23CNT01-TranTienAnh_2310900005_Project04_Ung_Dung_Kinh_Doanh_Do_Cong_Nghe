import sys
import os
import requests

# Force stdout to be utf-8
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

# 1. Login
login_url = "http://127.0.0.1:5000/api/tta_auth/login"
login_payload = {
    "email": "tienanh@test.com",
    "password": "new_test_password_123"
}

print(f"Logging in to {login_url}...")
r_login = requests.post(login_url, json=login_payload)
print(f"Login status: {r_login.status_code}")
if r_login.status_code != 200:
    print("Login failed:", r_login.text)
    sys.exit(1)

login_data = r_login.json()
token = login_data.get("data", {}).get("token")
if not token:
    print("Token not found in login response:", login_data)
    sys.exit(1)

print("Logged in successfully. Token obtained.")

# 2. Post rental order
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
            'G5_MaSanPham': 15, # Laptop Lenovo Gaming Legion 5 15IRX10
            'G5_SoLuong': 1,
            'G5_GiaThue': 300000.0
        }
    ]
}

headers = {
    "Authorization": f"Bearer {token}"
}

print(f"Posting rental request to {rent_url}...")
r_rent = requests.post(rent_url, json=rent_payload, headers=headers)
print(f"Rent status: {r_rent.status_code}")
print("Response text:")
print(r_rent.text)
