from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.modules.tta_giatrithuoctinh import tta_giatrithuoctinh_service as service
from app.utils.helpers import response_success, response_error

giatrithuoctinh_admin_bp = Blueprint("giatrithuoctinh_admin", __name__)

def is_admin():
    claims = get_jwt()
    return claims.get("vai_tro") == "admin"

@giatrithuoctinh_admin_bp.route("", methods=["GET"])
@jwt_required()
def get_all():
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    params = request.args.to_dict()
    data = service.get_all_attribute_values(params)
    return response_success(data=data)

@giatrithuoctinh_admin_bp.route("", methods=["POST"])
@jwt_required()
def create():
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    service.save_attribute_value(data)
    return response_success(message="Lưu giá trị thuộc tính thành công.")

@giatrithuoctinh_admin_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    service.update_attribute_value(id, data)
    return response_success(message="Cập nhật thành công.")

@giatrithuoctinh_admin_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    if not is_admin():
        return response_error("Không có quyền truy cập.", 403)
    service.delete_attribute_value(id)
    return response_success(message="Xóa thành công.")
