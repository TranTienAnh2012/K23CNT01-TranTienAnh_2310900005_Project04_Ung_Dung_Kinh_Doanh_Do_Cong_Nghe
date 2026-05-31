from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.Nhanvien.nvk_lich_tuvan import nvk_lich_tuvan_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import staff_required

class LichTuVanListResource(Resource):
    @jwt_required()
    @staff_required
    def get(self):
        from flask_jwt_extended import get_jwt, get_jwt_identity
        claims = get_jwt()
        role = str(claims.get("vai_tro", "")).lower()
        
        params = request.args.to_dict()
        if role == 'nhanvien':
            params['G5_MaNhanVien'] = int(get_jwt_identity())
            
        data = service.get_all(params)
        return response_success(data=data)

    @jwt_required()
    @staff_required
    def post(self):
        data = request.get_json()
        service.create(data)
        return response_success(message="Thêm thành công.")

class LichTuVanResource(Resource):
    @jwt_required()
    @staff_required
    def get(self, id):
        from flask_jwt_extended import get_jwt, get_jwt_identity
        claims = get_jwt()
        role = str(claims.get("vai_tro", "")).lower()
        
        if role == 'nhanvien':
            staff_id = int(get_jwt_identity())
            if not service.is_assigned_to_staff(id, staff_id):
                return response_error("Không có quyền truy cập.", 403)
                
        data = service.get_by_id(id)
        if not data:
            return response_error("Không tồn tại.", 404)
        return response_success(data=data)

    @jwt_required()
    @staff_required
    def put(self, id):
        from flask_jwt_extended import get_jwt, get_jwt_identity
        claims = get_jwt()
        role = str(claims.get("vai_tro", "")).lower()
        
        if role == 'nhanvien':
            staff_id = int(get_jwt_identity())
            if not service.is_assigned_to_staff(id, staff_id):
                return response_error("Không có quyền truy cập.", 403)
                
        data = request.get_json()
        service.update(id, data)
        return response_success(message="Cập nhật thành công.")

    @jwt_required()
    @staff_required
    def delete(self, id):
        from flask_jwt_extended import get_jwt, get_jwt_identity
        claims = get_jwt()
        role = str(claims.get("vai_tro", "")).lower()
        
        if role == 'nhanvien':
            staff_id = int(get_jwt_identity())
            if not service.is_assigned_to_staff(id, staff_id):
                return response_error("Không có quyền truy cập.", 403)
                
        service.delete(id)
        return response_success(message="Xóa thành công.")
