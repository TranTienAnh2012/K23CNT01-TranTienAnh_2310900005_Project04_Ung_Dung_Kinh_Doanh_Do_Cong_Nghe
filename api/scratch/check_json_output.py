import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.modules.tta_danhmuc import tta_danhmuc_repo as repo
import json

result = repo.get_all()
print(json.dumps(result, indent=2))
