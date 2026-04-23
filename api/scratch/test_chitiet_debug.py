import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Reload module from disk (bypass cache)
import importlib
import app.modules.tta_chitiet_donhang.tta_chitiet_donhang_repo as repo_module
importlib.reload(repo_module)

try:
    result = repo_module.get_all()
    print(f"OK - tta_chitiet_donhang: {result['total']} records")
    for item in result['items'][:2]:
        print(f"  {item}")
except Exception as e:
    import traceback
    print(f"FAIL - {type(e).__name__}")
    traceback.print_exc()
