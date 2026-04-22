from app.modules.tta_thuoctinh import tta_thuoctinh_repo as repo

def get_all_attributes(params=None):
    return repo.get_all(params)

def get_attribute_detail(ma):
    return repo.get_by_id(ma)

def create_attribute(data):
    return repo.create(data)

def update_attribute(ma, data):
    return repo.update(ma, data)

def delete_attribute(ma):
    return repo.delete(ma)
