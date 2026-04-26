from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.modules.tta_voucher import tta_voucher_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required

class VoucherListResource(Resource):
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_vouchers(params)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    def post(self):
        data = request.get_json()
        data['UserIdCreate'] = get_jwt_identity()
        service.create_voucher(data)
        return response_success(message="Tạo voucher thành công.")

class VoucherResource(Resource):
    def get(self, id):
        data = service.get_voucher_by_id(id)
        if not data: return response_error("Voucher không tồn tại.", 404)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    def put(self, id):
        data = request.get_json()
        service.update_voucher(id, data)
        return response_success(message="Cập nhật voucher thành công.")

    @jwt_required()
    @admin_required
    def delete(self, id):
        service.delete_voucher(id)
        return response_success(message="Xóa voucher thành công.")
