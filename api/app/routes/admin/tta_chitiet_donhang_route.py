from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.modules.tta_chitiet_donhang import tta_chitiet_donhang_service as service
from app.utils.helpers import response_success, response_error

chitiet_donhang_admin_bp = Blueprint("chitiet_donhang_admin", __name__)

def is_admin():
    claims = get_jwt()
    return claims.get("vai_tro") == "admin"

@chitiet_donhang_admin_bp.route("", methods=["GET"])
@jwt_required()
def get_all():
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    params = request.args.to_dict()
    data = service.get_all_order_details(params)
    return response_success(data=data)

@chitiet_donhang_admin_bp.route("/<int:ma>", methods=["GET"])
@jwt_required()
def get_one(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = service.get_order_item_detail(ma)
    if not data:
        return response_error("Chi tiết không tồn tại.", 404)
    return response_success(data=data)

@chitiet_donhang_admin_bp.route("/<int:ma>", methods=["PUT"])
@jwt_required()
def update_qty(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    qty = data.get("so_luong")
    service.update_item_quantity(ma, qty)
    return response_success(message="Cập nhật số lượng thành công.")

@chitiet_donhang_admin_bp.route("/<int:ma>", methods=["DELETE"])
@jwt_required()
def delete(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    service.remove_item_from_order(ma)
    return response_success(message="Xóa mục khỏi đơn hàng thành công.")
