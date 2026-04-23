from app.modules.tta_giatrithuoctinh import tta_giatrithuoctinh_repo as repo

def get_all_values(params=None):
    return repo.get_all(params)

def get_values_by_product(ma_sp):
    return repo.get_by_sanpham(ma_sp)

def create_value(data):
    return repo.create(data)

def update_value(id, data):
    return repo.update_value(id, data)

def delete_value(id):
    return repo.delete_value(id)
