from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.modules.client.tta_donhang import tta_donhang_service as service
from app.utils.helpers import response_success, response_error

class ClientDonHangListResource(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        try:
            order_id = service.place_order(user_id, data)
            return response_success(data={"id": order_id}, message="Đặt hàng thành công.")
        except Exception as e:
            return response_error(f"Lỗi đặt hàng: {str(e)}", 500)
