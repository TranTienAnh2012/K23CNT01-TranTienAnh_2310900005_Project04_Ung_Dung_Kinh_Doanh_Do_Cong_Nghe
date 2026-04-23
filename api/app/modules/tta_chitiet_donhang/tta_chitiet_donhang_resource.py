from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.tta_chitiet_donhang import tta_chitiet_donhang_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required

class ChiTietDonHangListResource(Resource):
    @jwt_required()
    @admin_required
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_details(params)
        return response_success(data=data)

class ChiTietDonHangResource(Resource):
    @jwt_required()
    @admin_required
    def get(self, ma):
        data = service.get_detail_by_id(ma)
        if not data:
            return response_error("Chi tiết đơn hàng không tồn tại.", 404)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    def put(self, ma):
        data = request.get_json()
        new_qty = data.get('SoLuong')
        if new_qty is None:
            return response_error("Thiếu số lượng mới.", 400)
        service.update_detail_qty(ma, new_qty)
        return response_success(message="Cập nhật số lượng thành công.")

    @jwt_required()
    @admin_required
    def delete(self, ma):
        service.delete_detail(ma)
        return response_success(message="Xóa chi tiết đơn hàng thành công.")
