from flask_jwt_extended import create_access_token
from app.modules.auth import auth_repo as repo

def authenticate_user(email, password):
    user_row = repo.find_user_by_credentials(email, password)
    if not user_row:
        return None
    
    # Convert Row to dict safely
    user = dict(user_row._mapping)
        
    token = create_access_token(
        identity=user['G5_MaNguoiDung'],
        additional_claims={
            "email": user['G5_Email'],
            "vai_tro": user['G5_VaiTro']
        }
    )
    
    return {
        "token": token,
        "user": {
            "id": user['G5_MaNguoiDung'],
            "email": user['G5_Email'],
            "name": user['G5_HoTen'],
            "vai_tro": user['G5_VaiTro']
        }
    }
