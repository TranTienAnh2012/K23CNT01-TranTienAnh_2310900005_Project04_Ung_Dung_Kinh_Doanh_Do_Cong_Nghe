from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.modules.client.tta_voucher import tta_voucher_service as service
from app.utils.helpers import response_success, response_error

class ClientVoucherPublicResource(Resource):
    @jwt_required(optional=True)
    def get(self):
        user_id = get_jwt_identity()
        try:
            vouchers = service.get_public_vouchers(user_id)
            return response_success(data=vouchers, message="Lấy danh sách mã giảm giá thành công.")
        except Exception as e:
            return response_error(f"Lỗi lấy danh sách mã giảm giá: {str(e)}", 500)

class ClientVoucherClaimResource(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json() or {}
        voucher_id = data.get('VoucherId')
        if not voucher_id:
            return response_error("Thiếu thông tin mã giảm giá (VoucherId).", 400)
        try:
            service.claim_voucher(user_id, voucher_id)
            return response_success(message="Nhận mã giảm giá thành công.")
        except Exception as e:
            return response_error(str(e), 400)

class ClientVoucherMyResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        try:
            vouchers = service.get_my_vouchers(user_id)
            return response_success(data=vouchers, message="Lấy danh sách mã giảm giá của tôi thành công.")
        except Exception as e:
            return response_error(f"Lỗi lấy danh sách mã giảm giá của tôi: {str(e)}", 500)
