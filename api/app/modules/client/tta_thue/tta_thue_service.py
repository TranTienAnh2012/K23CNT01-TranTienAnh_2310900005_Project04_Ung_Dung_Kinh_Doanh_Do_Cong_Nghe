from app.modules.client.tta_thue import tta_thue_repo as repo

def get_sanpham_thue():
    return repo.get_sanpham_thue()

def get_donhang_thue(user_id):
    return repo.get_donhang_thue(user_id)

def create_donhang_thue(user_id, data):
    return repo.create_donhang_thue(user_id, data)

def cancel_donhang_thue(user_id, order_id):
    return repo.cancel_donhang_thue(user_id, order_id)
