from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.tta_danhmuc import tta_danhmuc_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required
from app.schemas.validation_schemas import DanhMucCreateSchema, DanhMucUpdateSchema, validate_schema

class DanhMucListResource(Resource):
    @jwt_required()
    @admin_required
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_categories(params)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    @validate_schema(DanhMucCreateSchema)
    def post(self):
        data = request.validated_data
        service.create_category(data)
        return response_success(message="Thêm danh mục thành công.")

class DanhMucResource(Resource):
    @jwt_required()
    @admin_required
    def get(self, ma):
        data = service.get_category_detail(ma)
        if not data:
            return response_error("Danh mục không tồn tại.", 404)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    @validate_schema(DanhMucUpdateSchema)
    def put(self, ma):
        data = request.validated_data
        service.update_category(ma, data)
        return response_success(message="Cập nhật danh mục thành công.")

    @jwt_required()
    @admin_required
    def delete(self, ma):
        service.delete_category(ma)
        return response_success(message="Xóa danh mục thành công.")
