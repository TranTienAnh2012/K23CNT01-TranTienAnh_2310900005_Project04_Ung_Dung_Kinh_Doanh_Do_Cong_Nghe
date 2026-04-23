from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.tta_giatrithuoctinh import tta_giatrithuoctinh_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required

class GiaTriThuocTinhListResource(Resource):
    @jwt_required()
    @admin_required
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_values(params)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    def post(self):
        data = request.get_json()
        service.create_value(data)
        return response_success(message="Thêm giá trị thuộc tính thành công.")

class GiaTriThuocTinhResource(Resource):
    @jwt_required()
    @admin_required
    def put(self, id):
        data = request.get_json()
        service.update_value(id, data)
        return response_success(message="Cập nhật giá trị thuộc tính thành công.")

    @jwt_required()
    @admin_required
    def delete(self, id):
        service.delete_value(id)
        return response_success(message="Xóa giá trị thuộc tính thành công.")
