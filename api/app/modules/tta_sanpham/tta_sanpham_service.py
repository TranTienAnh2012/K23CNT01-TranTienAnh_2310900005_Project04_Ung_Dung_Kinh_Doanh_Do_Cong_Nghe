from app.modules.tta_sanpham import tta_sanpham_repo as repo

def get_all_products(params=None):
    # Business logic có thể thêm ở đây (VD: lọc nâng cao, cache)
    return repo.get_all(params)

def get_product_detail(ma_sp):
    return repo.get_by_id(ma_sp)

def create_product(data):
    # Logic kiểm tra dữ liệu trước khi lưu
    return repo.create(data) # Cần thêm hàm create vào repo sau

def update_product(ma_sp, data):
    return repo.update(ma_sp, data)

def delete_product(ma_sp):
    return repo.delete(ma_sp)
