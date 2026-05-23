from app.modules.client.tta_sanpham import tta_sanpham_repo as repo

def get_all_products(params=None):
    return repo.get_all(params)

def get_product_detail(ma_sp):
    return repo.get_by_id(ma_sp)
