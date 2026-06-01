import sys
import os
import requests

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

# 1. Login
login_url = "http://127.0.0.1:5000/api/tta_auth/login"
login_payload = {
    "email": "tienanhtran777@gmail.com",
    "password": "tienanh2005"
}

print(f"Logging in as tienanhtran777@gmail.com...")
r_login = requests.post(login_url, json=login_payload)
print(f"Login status: {r_login.status_code}")
if r_login.status_code != 200:
    print("Login failed:", r_login.text)
    sys.exit(1)

token = r_login.json().get("data", {}).get("token")
print("Token obtained.")

# 2. Cancel Order ID 3
cancel_url = "http://127.0.0.1:5000/api/client/tta_donhang/cancel/3"
headers = {
    "Authorization": f"Bearer {token}"
}

print(f"Sending cancel request to {cancel_url}...")
r_cancel = requests.put(cancel_url, headers=headers)
print(f"Cancel status: {r_cancel.status_code}")
print("Response text:")
print(r_cancel.text)
