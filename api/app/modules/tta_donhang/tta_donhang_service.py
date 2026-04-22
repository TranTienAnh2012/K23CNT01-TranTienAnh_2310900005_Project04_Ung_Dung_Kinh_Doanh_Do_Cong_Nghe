from app.modules.tta_donhang import tta_donhang_repo as repo

def get_all_orders(params=None):
    return repo.get_all(params)

def get_order_detail(ma):
    return repo.get_by_id(ma)

def place_order(data):
    return repo.create(data)

def change_order_status(ma, status):
    return repo.update_status(ma, status)

def cancel_order(ma):
    return repo.delete(ma)
