from app.modules.client.tta_danhmuc import tta_danhmuc_repo as repo

def get_all_categories(params=None):
    return repo.get_all(params)
