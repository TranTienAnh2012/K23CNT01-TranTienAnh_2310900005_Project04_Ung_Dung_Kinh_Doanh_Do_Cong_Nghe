from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.modules.tta_donhang import tta_donhang_service as service
from app.utils.helpers import response_success, response_error

donhang_admin_bp = Blueprint("donhang_admin", __name__)

def is_admin():
    claims = get_jwt()
    return claims.get("vai_tro") == "admin"

@donhang_admin_bp.route("", methods=["GET"])
@jwt_required()
def get_all():
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    params = request.args.to_dict()
    data = service.get_all_orders(params)
    return response_success(data=data)

@donhang_admin_bp.route("/<int:ma>", methods=["GET"])
@jwt_required()
def get_one(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = service.get_order_detail(ma)
    if not data:
        return response_error("Đơn hàng không tồn tại.", 404)
    return response_success(data=data)

@donhang_admin_bp.route("/<int:ma>/status", methods=["PUT"])
@jwt_required()
def update_status(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    status = data.get("trang_thai")
    service.change_order_status(ma, status)
    return response_success(message="Cập nhật trạng thái thành công.")

@donhang_admin_bp.route("/<int:ma>", methods=["DELETE"])
@jwt_required()
def delete(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    service.cancel_order(ma)
    return response_success(message="Xóa đơn hàng thành công.")
