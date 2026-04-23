import requests
import json

url = "http://localhost:5000/api/tta_auth/login"
payload = {
    "email": "admin@g5store.vn",
    "password": "admin123"
}
headers = {'Content-Type': 'application/json'}

try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    data = response.json()
    # Masking sensitive info and avoiding non-ascii
    print(f"Status: {data.get('status')}")
    print(f"Has Token: {'token' in data.get('data', {})}")
    print(f"Data Keys: {list(data.get('data', {}).keys())}")
except Exception as e:
    print(f"Error: {e}")
