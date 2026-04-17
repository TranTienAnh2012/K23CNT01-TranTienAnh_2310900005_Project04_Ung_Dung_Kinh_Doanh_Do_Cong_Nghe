from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.db.queries import tta_user_query as db
from app.utils.helpers import response_success, response_error

user_bp = Blueprint("user", __name__)

def is_admin():
    claims = get_jwt()
    return claims.get("vai_tro") == "admin"

@user_bp.route("", methods=["GET"])
@jwt_required()
def get_all():
    if not is_admin():
        return response_error("Quyen truy cap bi tu choi.", 403)
    params = request.args.to_dict()
    data = db.get_all(params)
    return response_success(data=data)

@user_bp.route("/<int:ma>", methods=["GET"])
@jwt_required()
def get_one(ma):
    if not is_admin():
        return response_error("Quyen truy cap bi tu choi.", 403)
    data = db.get_by_id(ma)
    if not data:
        return response_error("Nguoi dung khong ton tai.", 404)
    return response_success(data=data)
