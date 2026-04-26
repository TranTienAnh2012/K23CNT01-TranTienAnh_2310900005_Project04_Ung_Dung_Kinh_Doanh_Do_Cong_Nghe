from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.modules.tta_donhang import tta_donhang_service as service
from app.utils.helpers import response_success

donhang_client_bp = Blueprint("donhang_client", __name__)

@donhang_client_bp.route("", methods=["POST"])
@jwt_required()
def place_order():
    data = request.get_json()
    order_id = service.place_order(data)
    return response_success(data={"id": order_id}, message="Đặt hàng thành công.")
