from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.Nhanvien.nvk_nhanvien import nvk_nhanvien_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import staff_required

class LichTuVanNhanVienListResource(Resource):
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
        from flask_jwt_extended import get_jwt, get_jwt_identity
        claims = get_jwt()
        role = str(claims.get("vai_tro", "")).lower()
        
        data = request.get_json()
        if role == 'nhanvien':
            data['G5_MaNhanVien'] = int(get_jwt_identity())
            
        service.create(data)
        return response_success(message="Thêm thành công.")

class LichTuVanNhanVienResource(Resource):
    @jwt_required()
    @staff_required
    def get(self, id):
        from flask_jwt_extended import get_jwt, get_jwt_identity
        claims = get_jwt()
        role = str(claims.get("vai_tro", "")).lower()
        
        data = service.get_by_id(id)
        if not data:
            return response_error("Không tồn tại.", 404)
            
        if role == 'nhanvien' and data.get('G5_MaNhanVien') != int(get_jwt_identity()):
            return response_error("Không có quyền truy cập.", 403)
            
        return response_success(data=data)

    @jwt_required()
    @staff_required
    def put(self, id):
        from flask_jwt_extended import get_jwt, get_jwt_identity
        claims = get_jwt()
        role = str(claims.get("vai_tro", "")).lower()
        
        existing = service.get_by_id(id)
        if not existing:
            return response_error("Không tồn tại.", 404)
            
        if role == 'nhanvien' and existing.get('G5_MaNhanVien') != int(get_jwt_identity()):
            return response_error("Không có quyền truy cập.", 403)
            
        data = request.get_json()
        if role == 'nhanvien':
            data['G5_MaNhanVien'] = int(get_jwt_identity())
            
        service.update(id, data)
        return response_success(message="Cập nhật thành công.")

    @jwt_required()
    @staff_required
    def delete(self, id):
        from flask_jwt_extended import get_jwt, get_jwt_identity
        claims = get_jwt()
        role = str(claims.get("vai_tro", "")).lower()
        
        existing = service.get_by_id(id)
        if not existing:
            return response_error("Không tồn tại.", 404)
            
        if role == 'nhanvien' and existing.get('G5_MaNhanVien') != int(get_jwt_identity()):
            return response_error("Không có quyền truy cập.", 403)
            
        service.delete(id)
        return response_success(message="Xóa thành công.")
