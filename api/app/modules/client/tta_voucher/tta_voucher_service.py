from app.modules.client.tta_voucher import tta_voucher_repo as repo

def get_public_vouchers(user_id=None):
    return repo.get_public_vouchers(user_id)

def claim_voucher(user_id, voucher_id):
    return repo.claim_voucher(user_id, voucher_id)

def get_my_vouchers(user_id):
    return repo.get_my_vouchers(user_id)
