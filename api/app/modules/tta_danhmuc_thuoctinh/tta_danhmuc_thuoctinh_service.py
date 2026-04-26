from app.modules.tta_danhmuc_thuoctinh import tta_danhmuc_thuoctinh_repo as repo

def get_all_links(params=None):
    return repo.get_all(params)

def create_link(data):
    return repo.create(data)

def update_link(id, data):
    return repo.update_link(id, data)

def delete_link(id):
    return repo.delete_link(id)

def get_attributes_by_product(ma_sp):
    return repo.get_by_product(ma_sp)
