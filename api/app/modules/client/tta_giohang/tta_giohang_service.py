from app.modules.client.tta_giohang import tta_giohang_repo as repo

def get_by_user_id(user_id):
    return repo.get_by_user_id(user_id)

def add_to_cart(user_id, data):
    return repo.add_to_cart(user_id, data)

def update_quantity(id, user_id, qty):
    return repo.update_quantity(id, user_id, qty)

def delete_item(id, user_id):
    return repo.delete_item(id, user_id)
