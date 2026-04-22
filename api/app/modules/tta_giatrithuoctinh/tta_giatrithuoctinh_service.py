from app.modules.tta_giatrithuoctinh import tta_giatrithuoctinh_repo as repo

def get_all_attribute_values(params=None):
    return repo.get_all(params)

def get_values_by_product(ma_sp):
    return repo.get_by_sanpham(ma_sp)

def save_attribute_value(data):
    return repo.create(data)

def update_attribute_value(id, data):
    return repo.update(id, data)

def delete_attribute_value(id):
    return repo.delete(id)
