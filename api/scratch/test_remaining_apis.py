import requests

def test_apis():
    base_url = "http://127.0.0.1:5000/api"
    endpoints = ["/tta_user", "/tta_chitiet_donhang"]
    
    for ep in endpoints:
        print(f"\n--- Testing {ep} ---")
        try:
            res = requests.get(base_url + ep)
            print(f"Status: {res.status_code}")
            print(f"Response: {res.text}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_apis()
