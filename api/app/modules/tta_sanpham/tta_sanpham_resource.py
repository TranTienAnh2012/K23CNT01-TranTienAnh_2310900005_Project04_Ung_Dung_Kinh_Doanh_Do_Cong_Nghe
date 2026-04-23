from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.tta_sanpham import tta_sanpham_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required
from app.schemas.validation_schemas import SanPhamCreateSchema, SanPhamUpdateSchema, validate_schema

class SanPhamListResource(Resource):
    @jwt_required()
    @admin_required
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_products(params)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    @validate_schema(SanPhamCreateSchema)
    def post(self):
        data = request.validated_data
        service.create_product(data)
        return response_success(message="Thêm sản phẩm thành công.")

class SanPhamResource(Resource):
    @jwt_required()
    @admin_required
    def get(self, ma):
        data = service.get_product_detail(ma)
        if not data:
            return response_error("Sản phẩm không tồn tại.", 404)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    @validate_schema(SanPhamUpdateSchema)
    def put(self, ma):
        data = request.validated_data
        service.update_product(ma, data)
        return response_success(message="Cập nhật sản phẩm thành công.")

    @jwt_required()
    @admin_required
    def delete(self, ma):
        service.delete_product(ma)
        return response_success(message="Xóa sản phẩm thành công.")
