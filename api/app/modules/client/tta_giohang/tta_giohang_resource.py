from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.modules.client.tta_giohang import tta_giohang_service as service
from app.utils.helpers import response_success, response_error

class ClientGioHangListResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        try:
            items = service.get_by_user_id(user_id)
            return response_success(data=items, message="Lấy danh sách giỏ hàng thành công.")
        except Exception as e:
            return response_error(f"Lỗi: {str(e)}", 500)

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        try:
            cart_id = service.add_to_cart(user_id, data)
            return response_success(data={"id": cart_id}, message="Thêm vào giỏ hàng thành công.")
        except Exception as e:
            return response_error(f"Lỗi thêm vào giỏ hàng: {str(e)}", 500)

class ClientGioHangResource(Resource):
    @jwt_required()
    def put(self, id):
        user_id = get_jwt_identity()
        data = request.get_json()
        qty = data.get('SoLuong')
        if qty is None:
            return response_error("Thiếu số lượng.", 400)
        try:
            service.update_quantity(id, user_id, int(qty))
            return response_success(message="Cập nhật số lượng thành công.")
        except Exception as e:
            return response_error(f"Lỗi cập nhật: {str(e)}", 500)

    @jwt_required()
    def delete(self, id):
        user_id = get_jwt_identity()
        try:
            service.delete_item(id, user_id)
            return response_success(message="Xóa sản phẩm khỏi giỏ hàng thành công.")
        except Exception as e:
            return response_error(f"Lỗi xóa sản phẩm: {str(e)}", 500)
