from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.modules.tta_danhgia import tta_danhgia_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required

class ReviewListResource(Resource):
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_reviews(params)
        return response_success(data=data)

    @jwt_required()
    def post(self):
        data = request.get_json()
        # Automatically set MaNguoiDung from JWT if not provided
        if not data.get('MaNguoiDung'):
            data['MaNguoiDung'] = get_jwt_identity()
        
        service.create_review(data)
        return response_success(message="Gửi đánh giá thành công.")

# Nghiệp vụ: Admin chỉ có quyền xem danh sách và xóa đánh giá, không được phép sửa đổi đánh giá của khách hàng.
class ReviewResource(Resource):
    @jwt_required()
    @admin_required
    def delete(self, id):
        service.delete_review(id)
        return response_success(message="Xóa đánh giá thành công.")
