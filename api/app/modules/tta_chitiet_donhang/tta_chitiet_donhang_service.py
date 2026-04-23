from app.modules.tta_chitiet_donhang import tta_chitiet_donhang_repo as repo

def get_all_details(params=None):
    return repo.get_all(params)

def get_detail_by_id(ma):
    return repo.get_by_id(ma)

def update_detail_qty(ma, qty):
    return repo.update_qty(ma, qty)

def delete_detail(ma):
    return repo.delete_detail(ma)
