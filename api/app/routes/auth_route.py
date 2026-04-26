from flask import Blueprint, request
from app.modules.auth import auth_service as service
from app.utils.helpers import response_success, response_error

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    result, error = service.authenticate_user(email, password)
    if error:
        return response_error(error, 401)
        
    return response_success(data=result, message="Đăng nhập thành công.")
