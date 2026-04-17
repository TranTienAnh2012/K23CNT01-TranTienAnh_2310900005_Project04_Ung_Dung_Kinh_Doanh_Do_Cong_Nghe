from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.db.queries import tta_danhmuc_query as db
from app.utils.helpers import response_success, response_error

danhmuc_bp = Blueprint("danhmuc", __name__)

def is_admin():
    claims = get_jwt()
    return claims.get("vai_tro") == "admin"

@danhmuc_bp.route("", methods=["GET"])
def get_all():
    params = request.args.to_dict()
    data = db.get_all(params)
    return response_success(data=data)

@danhmuc_bp.route("/<int:ma>", methods=["GET"])
def get_one(ma):
    data = db.get_by_id(ma)
    if not data:
        return response_error("Danh muc khong ton tai.", 404)
    return response_success(data=data)

@danhmuc_bp.route("", methods=["POST"])
@jwt_required()
def create():
    if not is_admin():
        return response_error("Quyen truy cap bi tu choi.", 403)
    data = request.get_json()
    db.create(data)
    return response_success(message="Them danh muc thanh cong.")

@danhmuc_bp.route("/<int:ma>", methods=["PUT"])
@jwt_required()
def update(ma):
    if not is_admin():
        return response_error("Quyen truy cap bi tu choi.", 403)
    data = request.get_json()
    db.update(ma, data)
    return response_success(message="Cap nhat danh muc thanh cong.")

@danhmuc_bp.route("/<int:ma>", methods=["DELETE"])
@jwt_required()
def delete(ma):
    if not is_admin():
        return response_error("Quyen truy cap bi tu choi.", 403)
    db.delete(ma)
    return response_success(message="Xoa danh muc thanh cong.")
