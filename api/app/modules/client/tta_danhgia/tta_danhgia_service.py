from app.modules.client.tta_danhgia import tta_danhgia_repo as repo

def get_product_reviews(ma_sp):
    return repo.get_product_reviews(ma_sp)

def check_can_review(user_id, ma_sp):
    return repo.check_can_review(user_id, ma_sp)

def create_review(user_id, data):
    return repo.create_review(user_id, data)
