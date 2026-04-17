import requests

BASE_URL = "http://127.0.0.1:5000"

def verify_all():
    # 1. Login
    print("--- Testing Login ---")
    login_data = {"email": "admin@g5store.vn", "password": "admin123"}
    try:
        res = requests.post(f"{BASE_URL}/api/tta_auth/login", json=login_data)
        print(f"Login Status: {res.status_code}")
        if res.status_code == 200:
            token = res.json()['data']['token']
            print("Login SUCCESS. Token obtained.")
            
            # 2. Fetch Categories
            print("\n--- Testing Categories Data ---")
            headers = {"Authorization": f"Bearer {token}"}
            res_dm = requests.get(f"{BASE_URL}/api/tta_danhmuc", headers=headers)
            print(f"Categories Status: {res_dm.status_code}")
            print(f"Categories Data: {res_dm.json()}")
            
            # 3. Fetch Orders
            print("\n--- Testing Orders Data ---")
            res_dh = requests.get(f"{BASE_URL}/api/tta_donhang", headers=headers)
            print(f"Orders Status: {res_dh.status_code}")
            print(f"Orders Data: {res_dh.json()}")
        else:
            print(f"Login FAILED: {res.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_all()
