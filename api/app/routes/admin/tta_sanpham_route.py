from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.modules.tta_sanpham import tta_sanpham_service as service # Sử dụng service thay vì query trực tiếp
from app.utils.helpers import response_success, response_error

# Blueprint cho các chức năng Admin của Sản phẩm
sanpham_admin_bp = Blueprint("sanpham_admin", __name__)

def is_admin():
    claims = get_jwt()
    return claims.get("vai_tro") == "admin"

@sanpham_admin_bp.route("", methods=["GET"])
@jwt_required()
def get_all():
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    params = request.args.to_dict()
    data = service.get_all_products(params)
    return response_success(data=data)

@sanpham_admin_bp.route("/<int:ma>", methods=["GET"])
@jwt_required()
def get_one(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = service.get_product_detail(ma)
    if not data:
        return response_error("Sản phẩm không tồn tại.", 404)
    return response_success(data=data)

@sanpham_admin_bp.route("", methods=["POST"])
@jwt_required()
def create():
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    service.create_product(data)
    return response_success(message="Thêm sản phẩm thành công.")

@sanpham_admin_bp.route("/<int:ma>", methods=["PUT"])
@jwt_required()
def update(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    service.update_product(ma, data)
    return response_success(message="Cập nhật sản phẩm thành công.")

@sanpham_admin_bp.route("/<int:ma>", methods=["DELETE"])
@jwt_required()
def delete(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    service.delete_product(ma)
    return response_success(message="Xóa sản phẩm thành công.")
