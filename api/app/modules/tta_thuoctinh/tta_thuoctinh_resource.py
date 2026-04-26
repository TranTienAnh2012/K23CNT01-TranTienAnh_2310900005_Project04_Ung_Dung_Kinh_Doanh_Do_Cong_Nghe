from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.tta_thuoctinh import tta_thuoctinh_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required

class ThuocTinhListResource(Resource):
    @jwt_required()
    @admin_required
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_attributes(params)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    def post(self):
        data = request.get_json()
        service.create_attribute(data)
        return response_success(message="Thêm thuộc tính thành công.")

class ThuocTinhResource(Resource):
    @jwt_required()
    @admin_required
    def get(self, ma):
        data = service.get_attribute_detail(ma)
        if not data:
            return response_error("Thuộc tính không tồn tại.", 404)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    def put(self, ma):
        data = request.get_json()
        service.update_attribute(ma, data)
        return response_success(message="Cập nhật thuộc tính thành công.")

    @jwt_required()
    @admin_required
    def delete(self, ma):
        service.delete_attribute(ma)
        return response_success(message="Xóa thuộc tính thành công.")
