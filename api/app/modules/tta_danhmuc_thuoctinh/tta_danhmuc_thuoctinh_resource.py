from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.tta_danhmuc_thuoctinh import tta_danhmuc_thuoctinh_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required

class DanhMucThuocTinhListResource(Resource):
    @jwt_required()
    @admin_required
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_links(params)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    def post(self):
        data = request.get_json()
        service.create_link(data)
        return response_success(message="Thêm liên kết danh mục - thuộc tính thành công.")

class DanhMucThuocTinhResource(Resource):
    @jwt_required()
    @admin_required
    def put(self, id):
        data = request.get_json()
        service.update_link(id, data)
        return response_success(message="Cập nhật liên kết thành công.")

    @jwt_required()
    @admin_required
    def delete(self, id):
        service.delete_link(id)
        return response_success(message="Xóa liên kết thành công.")

class ProductAttributeResource(Resource):
    def get(self, ma_sp):
        data = service.get_attributes_by_product(ma_sp)
        return response_success(data=data)
