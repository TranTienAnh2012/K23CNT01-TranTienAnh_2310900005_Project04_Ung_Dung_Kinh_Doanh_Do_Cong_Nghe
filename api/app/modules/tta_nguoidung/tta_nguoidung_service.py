from app.modules.tta_nguoidung import tta_nguoidung_repo as repo

def get_all_users(params=None):
    return repo.get_all(params)

def get_user_detail(ma):
    return repo.get_by_id(ma)

def create_user(data):
    return repo.create(data)

def update_user(ma, data):
    return repo.update_user(ma, data)

def delete_user(ma):
    return repo.delete_user(ma)
