from app.modules.client.tta_banner import tta_banner_repo as repo

def get_all_banners(params=None):
    return repo.get_all(params)
