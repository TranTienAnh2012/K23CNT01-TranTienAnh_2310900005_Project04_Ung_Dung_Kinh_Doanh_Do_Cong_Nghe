from app.modules.tta_danhmuc_thuoctinh import tta_danhmuc_thuoctinh_repo as repo

def get_all_attribute_sets(params=None):
    return repo.get_all(params)

def create_attribute_set(data):
    return repo.create(data)

def update_attribute_set(id, data):
    return repo.update(id, data)

def delete_attribute_set(id):
    return repo.delete(id)

def get_attributes_by_product(ma_sp):
    return repo.get_by_product(ma_sp)
