"""
Dien Tu Store - Order Detail Routes (tta_chitietdonhang_route)
Endpoints for managing individual order items.
"""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.db.queries import tta_chitietdonhang_query as ct_db
from app.utils.helpers import response_success, response_error

chitietdonhang_bp = Blueprint("chitietdonhang", __name__)

def is_admin():
    claims = get_jwt()
    return claims.get("vai_tro") == "admin"

@chitietdonhang_bp.route("", methods=["GET"])
@jwt_required()
def get_all():
    if not is_admin():
        return response_error("Quyen truy cap bi tu choi.", 403)
    
    params = request.args.to_dict()
    data = ct_db.get_all(params)
    return response_success(data=data)

@chitietdonhang_bp.route("/<int:ma>", methods=["GET"])
@jwt_required()
def get_one(ma):
    if not is_admin():
        return response_error("Quyen truy cap bi tu choi.", 403)
        
    data = ct_db.get_by_id(ma)
    if not data:
        return response_error("Chi tiet khong ton tai.", 404)
    return response_success(data=data)

@chitietdonhang_bp.route("/<int:ma>", methods=["PUT"])
@jwt_required()
def update(ma):
    if not is_admin():
        return response_error("Quyen truy cap bi tu choi.", 403)
        
    data = request.get_json()
    new_qty = data.get("so_luong")
    if new_qty is None or int(new_qty) < 0:
        return response_error("So luong khong hop le.", 400)
        
    success = ct_db.update_item_qty(ma, int(new_qty))
    if not success:
        return response_error("Cap nhat that bai.", 400)
        
    return response_success(message="Cap nhat so luong va tinh lai don hang thanh cong.")

@chitietdonhang_bp.route("/<int:ma>", methods=["DELETE"])
@jwt_required()
def delete(ma):
    if not is_admin():
        return response_error("Quyen truy cap bi tu choi.", 403)
        
    success = ct_db.delete_item(ma)
    if not success:
        return response_error("Xoa that bai.", 400)
    return response_success(message="Xoa san pham khoi don hang va hoan kho thanh cong.")
