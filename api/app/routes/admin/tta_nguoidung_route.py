from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.modules.tta_nguoidung import tta_nguoidung_service as service
from app.utils.helpers import response_success, response_error

nguoidung_admin_bp = Blueprint("nguoidung_admin", __name__)

def is_admin():
    claims = get_jwt()
    return claims.get("vai_tro") == "admin"

@nguoidung_admin_bp.route("", methods=["GET"])
@jwt_required()
def get_all():
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    params = request.args.to_dict()
    data = service.get_all_users(params)
    return response_success(data=data)

@nguoidung_admin_bp.route("/<int:ma>", methods=["GET"])
@jwt_required()
def get_one(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = service.get_user_detail(ma)
    if not data:
        return response_error("Người dùng không tồn tại.", 404)
    return response_success(data=data)

@nguoidung_admin_bp.route("", methods=["POST"])
@jwt_required()
def create():
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    service.create_user(data)
    return response_success(message="Thêm người dùng thành công.")

@nguoidung_admin_bp.route("/<int:ma>", methods=["PUT"])
@jwt_required()
def update(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    service.update_user(ma, data)
    return response_success(message="Cập nhật người dùng thành công.")

@nguoidung_admin_bp.route("/<int:ma>", methods=["DELETE"])
@jwt_required()
def delete(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    service.delete_user(ma)
    return response_success(message="Xóa người dùng thành công.")
