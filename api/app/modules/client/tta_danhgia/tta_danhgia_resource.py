from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.modules.client.tta_danhgia import tta_danhgia_service as service
from app.utils.helpers import response_success, response_error

class ClientReviewListResource(Resource):
    def get(self, ma_sp):
        try:
            data = service.get_product_reviews(ma_sp)
            return response_success(data=data, message="Lấy danh sách đánh giá thành công.")
        except Exception as e:
            return response_error(f"Lỗi: {str(e)}", 500)

class ClientReviewCheckResource(Resource):
    @jwt_required()
    def get(self, ma_sp):
        user_id = get_jwt_identity()
        try:
            allowed = service.check_can_review(user_id, ma_sp)
            return response_success(data={"allowed": allowed})
        except Exception as e:
            return response_error(f"Lỗi: {str(e)}", 500)

class ClientReviewCreateResource(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        ma_sp = data.get('MaSanPham')
        if not ma_sp or not data.get('SoSao'):
            return response_error("Thiếu thông tin đánh giá.", 400)
            
        try:
            # Recheck check_can_review for security
            if not service.check_can_review(user_id, ma_sp):
                return response_error("Bạn chưa mua sản phẩm này hoặc đã đánh giá trước đó.", 403)
                
            service.create_review(user_id, data)
            return response_success(message="Đánh giá thành công.")
        except Exception as e:
            return response_error(f"Lỗi thêm đánh giá: {str(e)}", 500)
