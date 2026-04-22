from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.core.config import SECRET_KEY
from app.db.connection import engine

def create_app():
    # Khởi tạo ứng dụng Flask
    app = Flask(__name__, static_folder='../../static', static_url_path='/static')
    
    # Cấu hình bảo mật
    app.config["SECRET_KEY"] = SECRET_KEY
    app.config["JWT_SECRET_KEY"] = SECRET_KEY
    
    # Kích hoạt CORS và JWT
    CORS(app) 
    JWTManager(app)
    
    # --- IMPORT VÀ ĐĂNG KÝ ROUTE XÁC THỰC ---
    from app.routes.auth_route import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/tta_auth")
    
    # --- IMPORT CÁC ROUTE ADMIN ---
    from app.routes.admin.tta_sanpham_route import sanpham_admin_bp
    from app.routes.admin.tta_danhmuc_route import danhmuc_admin_bp
    from app.routes.admin.tta_donhang_route import donhang_admin_bp
    from app.routes.admin.tta_nguoidung_route import nguoidung_admin_bp
    from app.routes.admin.tta_thuoctinh_route import thuoctinh_admin_bp
    from app.routes.admin.tta_danhmuc_thuoctinh_route import danhmuc_thuoctinh_admin_bp
    from app.routes.admin.tta_giatrithuoctinh_route import giatrithuoctinh_admin_bp
    from app.routes.admin.tta_chitiet_donhang_route import chitiet_donhang_admin_bp
    
    # Đăng ký Route Admin (Giữ tiền tố cũ để tương thích Frontend)
    app.register_blueprint(sanpham_admin_bp,           url_prefix="/api/tta_sanpham")
    app.register_blueprint(danhmuc_admin_bp,           url_prefix="/api/tta_danhmuc")
    app.register_blueprint(donhang_admin_bp,           url_prefix="/api/tta_donhang")
    app.register_blueprint(nguoidung_admin_bp,         url_prefix="/api/tta_user")
    app.register_blueprint(thuoctinh_admin_bp,         url_prefix="/api/tta_thuoctinh")
    app.register_blueprint(danhmuc_thuoctinh_admin_bp, url_prefix="/api/tta_danhmuc_thuoctinh")
    app.register_blueprint(giatrithuoctinh_admin_bp,   url_prefix="/api/tta_giatrithuoctinh")
    app.register_blueprint(chitiet_donhang_admin_bp,   url_prefix="/api/tta_chitiet_donhang")
    
    # --- IMPORT CÁC ROUTE CLIENT (Mới) ---
    from app.routes.client.tta_sanpham_route import sanpham_client_bp
    from app.routes.client.tta_danhmuc_route import danhmuc_client_bp
    from app.routes.client.tta_donhang_route import donhang_client_bp
    
    app.register_blueprint(sanpham_client_bp, url_prefix="/api/client/tta_sanpham")
    app.register_blueprint(danhmuc_client_bp, url_prefix="/api/client/tta_danhmuc")
    app.register_blueprint(donhang_client_bp, url_prefix="/api/client/tta_donhang")
    
    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "Backend standardized structure is fully operational!"}
        
    return app
