from app.modules.client.tta_tuvan import tta_tuvan_repo as repo

def get_dichvu_tuvan():
    return repo.get_dichvu_tuvan()

def get_staff_list():
    return repo.get_staff_list()

def get_lich_tuvan(user_id):
    return repo.get_lich_tuvan(user_id)

def book_lich_tuvan(user_id, data):
    return repo.book_lich_tuvan(user_id, data)

def cancel_lich_tuvan(user_id, booking_id):
    return repo.cancel_lich_tuvan(user_id, booking_id)
