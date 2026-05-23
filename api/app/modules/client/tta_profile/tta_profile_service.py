from app.modules.client.tta_profile import tta_profile_repo as repo

def get_profile(user_id):
    return repo.get_profile(user_id)

def update_profile(user_id, data):
    return repo.update_profile(user_id, data)

def change_password(user_id, current_pwd, new_pwd):
    return repo.change_password(user_id, current_pwd, new_pwd)
