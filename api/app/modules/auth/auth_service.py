from flask_jwt_extended import create_access_token
from app.modules.auth import auth_repo as repo

def authenticate_user(email, password):
    user = repo.find_user_by_credentials(email, password)
    if not user:
        return None, "Email hoặc mật khẩu không chính xác!"
    
    if user.G5_VaiTro != 'admin':
        return None, "Bạn không có quyền truy cập!"
        
    token = create_access_token(
        identity=user.G5_Email,
        additional_claims={"vai_tro": user.G5_VaiTro}
    )
    
    return {
        "token": token,
        "user": {
            "id": user.G5_MaNguoiDung,
            "email": user.G5_Email,
            "name": user.G5_HoTen
        }
    }, None
