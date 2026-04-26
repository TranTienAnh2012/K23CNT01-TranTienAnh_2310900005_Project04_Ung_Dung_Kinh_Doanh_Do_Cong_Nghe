from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.tta_nguoidung import tta_nguoidung_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required
from app.schemas.validation_schemas import NguoiDungCreateSchema, NguoiDungUpdateSchema, validate_schema

class NguoiDungListResource(Resource):
    @jwt_required()
    @admin_required
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_users(params)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    @validate_schema(NguoiDungCreateSchema)
    def post(self):
        data = request.validated_data
        service.create_user(data)
        return response_success(message="Thêm người dùng thành công.")

class NguoiDungResource(Resource):
    @jwt_required()
    @admin_required
    def get(self, ma):
        data = service.get_user_detail(ma)
        if not data:
            return response_error("Người dùng không tồn tại.", 404)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    @validate_schema(NguoiDungUpdateSchema)
    def put(self, ma):
        data = request.validated_data
        service.update_user(ma, data)
        return response_success(message="Cập nhật người dùng thành công.")

    @jwt_required()
    @admin_required
    def delete(self, ma):
        service.delete_user(ma)
        return response_success(message="Xóa người dùng thành công.")
