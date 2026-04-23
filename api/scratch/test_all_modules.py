import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Test all main modules
tests = [
    ("tta_danhmuc", "app.modules.tta_danhmuc.tta_danhmuc_repo"),
    ("tta_sanpham", "app.modules.tta_sanpham.tta_sanpham_repo"),
    ("tta_chitiet_donhang", "app.modules.tta_chitiet_donhang.tta_chitiet_donhang_repo"),
    ("tta_donhang", "app.modules.tta_donhang.tta_donhang_repo"),
    ("tta_thuoctinh", "app.modules.tta_thuoctinh.tta_thuoctinh_repo"),
    ("tta_giatrithuoctinh", "app.modules.tta_giatrithuoctinh.tta_giatrithuoctinh_repo"),
]

for name, module_path in tests:
    try:
        import importlib
        mod = importlib.import_module(module_path)
        result = mod.get_all()
        total = result.get('total', len(result.get('items', [])))
        print(f"[OK] {name}: {total} records")
    except Exception as e:
        err = str(e)
        if len(err) > 120:
            err = err[:120] + "..."
        print(f"[FAIL] {name}: {type(e).__name__}: {err}")
