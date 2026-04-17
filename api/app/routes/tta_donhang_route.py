"""
Dien Tu Store - Order Routes (tta_donhang_route)
Endpoints for managing orders.
"""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.db.queries import tta_donhang_query as db
from app.utils.helpers import response_success, response_error

donhang_bp = Blueprint("donhang", __name__)

def is_admin():
    claims = get_jwt()
    return claims.get("vai_tro") == "admin"

@donhang_bp.route("", methods=["GET"])
@jwt_required()
def get_all():
    params = request.args.to_dict()
    data = db.get_all(params)
    return response_success(data=data)

@donhang_bp.route("/<int:ma>", methods=["GET"])
@jwt_required()
def get_one(ma):
    data = db.get_by_id(ma)
    if not data:
        return response_error("Don hang khong ton tai.", 404)
    return response_success(data=data)

@donhang_bp.route("", methods=["POST"])
@jwt_required()
def create():
    data = request.get_json()
    try:
        order_id = db.create(data)
        return response_success(data={"id": order_id}, message="Tao don hang thanh cong.")
    except Exception as e:
        return response_error(f"Loi: {str(e)}", 400)

@donhang_bp.route("/<int:ma>/status", methods=["PUT"])
@jwt_required()
def update_status(ma):
    if not is_admin():
        return response_error("Quyen truy cap bi tu choi.", 403)
        
    data = request.get_json()
    new_status = data.get("trang_thai")
    if not new_status:
        return response_error("Trang thai khong hop le.", 400)
    
    success = db.update_status(ma, new_status)
    if not success:
        return response_error("Cap nhat that bai.", 400)
    return response_success(message="Cap nhat trang thai thanh cong.")

@donhang_bp.route("/<int:ma>", methods=["DELETE"])
@jwt_required()
def delete(ma):
    if not is_admin():
        return response_error("Quyen truy cap bi tu choi.", 403)
        
    success = db.delete(ma)
    if not success:
        return response_error("Xoa that bai.", 400)
    return response_success(message="Xoa don hang va hoan kho thanh cong.")
