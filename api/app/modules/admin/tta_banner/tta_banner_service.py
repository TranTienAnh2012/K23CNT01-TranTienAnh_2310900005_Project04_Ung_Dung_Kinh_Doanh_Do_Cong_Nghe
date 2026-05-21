from app.modules.admin.tta_banner import tta_banner_repo as repo

def get_all_banners(params=None):
    return repo.get_all(params)

def get_banner_detail(id):
    return repo.get_by_id(id)

def create_banner(data):
    return repo.create(data)

def update_banner(id, data):
    return repo.update_banner(id, data)

def delete_banner(id):
    return repo.delete_banner(id)
