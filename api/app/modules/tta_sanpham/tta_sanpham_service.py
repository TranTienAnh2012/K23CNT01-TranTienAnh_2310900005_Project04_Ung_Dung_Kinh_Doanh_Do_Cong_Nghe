from app.modules.tta_sanpham import tta_sanpham_repo as repo

def get_all_products(params=None):
    return repo.get_all(params)

def get_product_detail(ma_sp):
    return repo.get_by_id(ma_sp)

def create_product(data):
    return repo.create(data)

def update_product(ma_sp, data):
    return repo.update_product(ma_sp, data)

def delete_product(ma_sp):
    return repo.delete_product(ma_sp)
