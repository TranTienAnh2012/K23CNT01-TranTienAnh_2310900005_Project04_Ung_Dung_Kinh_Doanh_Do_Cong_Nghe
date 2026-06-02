from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.modules.client.tta_donhang import tta_donhang_service as service
from app.utils.helpers import response_success, response_error
import logging

logger = logging.getLogger(__name__)

class ClientDonHangListResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        try:
            orders = service.get_orders_by_user(user_id)
            return response_success(data=orders, message="Lấy danh sách đơn hàng thành công.")
        except Exception as e:
            return response_error(f"Lỗi lấy đơn hàng: {str(e)}", 500)

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        logger.warning(f"[place_order] user_id={user_id}, payload keys={list(data.keys()) if data else 'NULL'}, items={data.get('items') if data else 'NULL'}")
        try:
            order_id = service.place_order(user_id, data)
            return response_success(data={"id": order_id}, message="Đặt hàng thành công.")
        except Exception as e:
            logger.error(f"[place_order] Error: {str(e)}")
            return response_error(f"Lỗi đặt hàng: {str(e)}", 500)

class ClientDonHangResource(Resource):
    @jwt_required()
    def get(self, ma):
        user_id = get_jwt_identity()
        try:
            order = service.get_order_by_id(user_id, ma)
            if order:
                return response_success(data=order, message="Lấy chi tiết đơn hàng thành công.")
            return response_error("Không tìm thấy đơn hàng.", 404)
        except Exception as e:
            return response_error(f"Lỗi lấy chi tiết đơn hàng: {str(e)}", 500)

class ClientDonHangCancelResource(Resource):
    @jwt_required()
    def put(self, ma):
        user_id = get_jwt_identity()
        try:
            success = service.cancel_order(user_id, ma)
            if success:
                return response_success(message="Hủy đơn hàng thành công.")
            return response_error("Không thể hủy đơn hàng này. Chỉ có thể hủy đơn hàng ở trạng thái Chờ xác nhận.", 400)
        except Exception as e:
            return response_error(f"Lỗi hủy đơn hàng: {str(e)}", 500)


