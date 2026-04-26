from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.modules.tta_danhmuc import tta_danhmuc_service as service
from app.utils.helpers import response_success, response_error

danhmuc_admin_bp = Blueprint("danhmuc_admin", __name__)

def is_admin():
    claims = get_jwt()
    return claims.get("vai_tro") == "admin"

@danhmuc_admin_bp.route("", methods=["GET"])
@jwt_required()
def get_all():
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    params = request.args.to_dict()
    data = service.get_all_categories(params)
    return response_success(data=data)

@danhmuc_admin_bp.route("/<int:ma>", methods=["GET"])
@jwt_required()
def get_one(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = service.get_category_detail(ma)
    if not data:
        return response_error("Danh mục không tồn tại.", 404)
    return response_success(data=data)

@danhmuc_admin_bp.route("", methods=["POST"])
@jwt_required()
def create():
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    service.create_category(data)
    return response_success(message="Thêm danh mục thành công.")

@danhmuc_admin_bp.route("/<int:ma>", methods=["PUT"])
@jwt_required()
def update(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    service.update_category(ma, data)
    return response_success(message="Cập nhật danh mục thành công.")

@danhmuc_admin_bp.route("/<int:ma>", methods=["DELETE"])
@jwt_required()
def delete(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    service.delete_category(ma)
    return response_success(message="Xóa danh mục thành công.")
