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
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
