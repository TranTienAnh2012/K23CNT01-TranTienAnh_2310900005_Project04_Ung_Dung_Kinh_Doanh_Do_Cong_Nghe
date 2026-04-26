from app.modules.tta_voucher import tta_voucher_repo as repo

def get_all_vouchers(params=None):
    return repo.get_all(params)

def get_voucher_by_id(id):
    return repo.get_by_id(id)

def create_voucher(data):
    return repo.create(data)

def update_voucher(id, data):
    return repo.update_voucher(id, data)

def delete_voucher(id):
    return repo.delete_voucher(id)
