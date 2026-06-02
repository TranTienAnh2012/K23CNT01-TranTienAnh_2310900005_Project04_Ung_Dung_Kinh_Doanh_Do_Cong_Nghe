from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.Nhanvien.nvk_dichvu_tuvan import nvk_dichvu_tuvan_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import staff_required

class DichVuTuVanListResource(Resource):
    @jwt_required()
    @staff_required
    def get(self):
        params = request.args.to_dict()
        data = service.get_all(params)
        return response_success(data=data)

    @jwt_required()
    @staff_required
    def post(self):
        data = request.get_json()
        service.create(data)
        return response_success(message="Thêm thành công.")

class DichVuTuVanResource(Resource):
    @jwt_required()
    @staff_required
    def get(self, id):
        data = service.get_by_id(id)
        if not data:
            return response_error("Không tồn tại.", 404)
        return response_success(data=data)

    @jwt_required()
    @staff_required
    def put(self, id):
        data = request.get_json()
        service.update(id, data)
        return response_success(message="Cập nhật thành công.")

    @jwt_required()
    @staff_required
    def delete(self, id):
        service.delete(id)
        return response_success(message="Xóa thành công.")
