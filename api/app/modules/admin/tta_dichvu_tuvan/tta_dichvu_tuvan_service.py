from app.modules.admin.tta_dichvu_tuvan import tta_dichvu_tuvan_repo as repo

def get_all(params=None):
    return repo.get_all(params)

def get_by_id(id):
    return repo.get_by_id(id)

def create(data):
    return repo.create(data)

def update(id, data):
    return repo.update_item(id, data)

def delete(id):
    return repo.delete_item(id)
