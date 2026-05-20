from app.modules.client.tta_donhang import tta_donhang_repo as repo

def place_order(user_id, data):
    return repo.place_order(user_id, data)
