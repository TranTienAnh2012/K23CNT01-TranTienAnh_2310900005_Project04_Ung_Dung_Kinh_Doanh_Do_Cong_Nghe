from app.modules.client.tta_donhang import tta_donhang_repo as repo

def place_order(user_id, data):
    return repo.place_order(user_id, data)

def get_orders_by_user(user_id):
    return repo.get_orders_by_user(user_id)

def get_order_by_id(user_id, order_id):
    return repo.get_order_by_id(user_id, order_id)

def cancel_order(user_id, order_id):
    return repo.cancel_order(user_id, order_id)
