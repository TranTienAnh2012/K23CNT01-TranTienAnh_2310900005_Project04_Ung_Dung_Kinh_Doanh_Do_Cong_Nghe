from app.modules.tta_chitiet_donhang import tta_chitiet_donhang_repo as repo

def get_all_order_details(params=None):
    return repo.get_all(params)

def get_order_item_detail(ma):
    return repo.get_by_id(ma)

def update_item_quantity(ma, qty):
    return repo.update_qty(ma, qty)

def remove_item_from_order(ma):
    return repo.delete(ma)
