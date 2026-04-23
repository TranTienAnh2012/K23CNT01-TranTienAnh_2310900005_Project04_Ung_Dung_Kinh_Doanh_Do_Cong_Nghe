from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.tta_donhang import tta_donhang_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required
from app.schemas.validation_schemas import DonHangCreateSchema, validate_schema

class DonHangListResource(Resource):
    @jwt_required()
    @admin_required
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_orders(params)
        return response_success(data=data)

    @jwt_required()
    @validate_schema(DonHangCreateSchema)
    def post(self):
        data = request.validated_data
        order_id = service.create_order(data)
        return response_success(data={"id": order_id}, message="Đặt hàng thành công.")

class DonHangResource(Resource):
    @jwt_required()
    @admin_required
    def get(self, ma):
        data = service.get_order_detail(ma)
        if not data:
            return response_error("Đơn hàng không tồn tại.", 404)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    def put(self, ma):
        data = request.get_json()
        status = data.get('TrangThai')
        if not status:
            return response_error("Thiếu trạng thái đơn hàng.", 400)
        service.update_order_status(ma, status)
        return response_success(message="Cập nhật trạng thái đơn hàng thành công.")

    @jwt_required()
    @admin_required
    def delete(self, ma):
        service.delete_order(ma)
        return response_success(message="Xóa đơn hàng thành công.")
