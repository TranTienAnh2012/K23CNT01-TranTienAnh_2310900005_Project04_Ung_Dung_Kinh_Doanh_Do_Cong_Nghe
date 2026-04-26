import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.modules.tta_chitiet_donhang import tta_chitiet_donhang_repo as repo

try:
    result = repo.get_all()
    print(f"OK - tta_chitiet_donhang: Found {result['total']} records")
    for item in result['items'][:3]:
        print(f"  {item}")
except Exception as e:
    print(f"FAIL - {type(e).__name__}: {e}")
