from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.db.database import engine
from sqlalchemy import text

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    # Authenticate via SQL (using actual G5_ prefix)
    query = "SELECT * FROM G5_user WHERE G5_Email = :email AND G5_MatKhau = :pass AND G5_IsDeleted = 0"
    with engine.connect() as conn:
        user = conn.execute(text(query), {"email": email, "pass": password}).fetchone()
        
    if user:
        # User role: 'admin' = Admin
        if user.G5_VaiTro == 'admin':
            token = create_access_token(identity=user.G5_Email)
            return jsonify({
                "status": "success",
                "data": {
                    "token": token,
                    "user": {
                        "id": user.G5_MaNguoiDung,
                        "email": user.G5_Email,
                        "name": user.G5_HoTen
                    }
                }
            }), 200
        else:
            return jsonify({"status": "error", "message": "Bạn không có quyền truy cập!"}), 403
            
    return jsonify({"status": "error", "message": "Email hoặc mật khẩu không chính xác!"}), 401
