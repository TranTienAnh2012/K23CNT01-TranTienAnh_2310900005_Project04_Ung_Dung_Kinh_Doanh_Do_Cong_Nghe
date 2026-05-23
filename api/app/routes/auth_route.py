from flask import Blueprint, request
from app.modules.auth import auth_service as service
from app.utils.helpers import response_success, response_error

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    result = service.authenticate_user(email, password)
    if not result:
        return response_error("Email hoặc mật khẩu không chính xác.", 401)
        
    return response_success(data=result, message="Đăng nhập thành công.")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    phone = data.get("phone")

    if not email or not password or not name:
        return response_error("Vui lòng điền đầy đủ các thông tin bắt buộc (email, password, name).", 400)

    result, error = service.register_user(email, password, name, phone)
    if error:
        return response_error(error, 400)

    return response_success(data=result, message="Đăng ký tài khoản thành công.")
