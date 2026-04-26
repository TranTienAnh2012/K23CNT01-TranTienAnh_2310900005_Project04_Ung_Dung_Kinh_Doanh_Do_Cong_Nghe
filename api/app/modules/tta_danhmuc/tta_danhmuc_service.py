from app.modules.tta_danhmuc import tta_danhmuc_repo as repo

def get_all_categories(params=None):
    return repo.get_all(params)

def get_category_detail(ma):
    return repo.get_by_id(ma)

def create_category(data):
    return repo.create(data)

def update_category(ma, data):
    return repo.update_danhmuc(ma, data)

def delete_category(ma):
    return repo.delete_danhmuc(ma)
