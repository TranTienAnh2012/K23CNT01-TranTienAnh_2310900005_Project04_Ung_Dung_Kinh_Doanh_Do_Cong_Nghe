from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.modules.tta_thuoctinh import tta_thuoctinh_service as service
from app.utils.helpers import response_success, response_error

thuoctinh_admin_bp = Blueprint("thuoctinh_admin", __name__)

def is_admin():
    claims = get_jwt()
    return claims.get("vai_tro") == "admin"

@thuoctinh_admin_bp.route("", methods=["GET"])
@jwt_required()
def get_all():
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    params = request.args.to_dict()
    data = service.get_all_attributes(params)
    return response_success(data=data)

@thuoctinh_admin_bp.route("/<int:ma>", methods=["GET"])
@jwt_required()
def get_one(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = service.get_attribute_detail(ma)
    if not data:
        return response_error("Thuộc tính không tồn tại.", 404)
    return response_success(data=data)

@thuoctinh_admin_bp.route("", methods=["POST"])
@jwt_required()
def create():
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    service.create_attribute(data)
    return response_success(message="Thêm thuộc tính thành công.")

@thuoctinh_admin_bp.route("/<int:ma>", methods=["PUT"])
@jwt_required()
def update(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    service.update_attribute(ma, data)
    return response_success(message="Cập nhật thuộc tính thành công.")

@thuoctinh_admin_bp.route("/<int:ma>", methods=["DELETE"])
@jwt_required()
def delete(ma):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    service.delete_attribute(ma)
    return response_success(message="Xóa thuộc tính thành công.")
