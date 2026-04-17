from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.config import SECRET_KEY
from app.db.database import engine

def create_app():
    # Set static_folder to the parent's static directory
    app = Flask(__name__, static_folder='../static', static_url_path='/static')
    app.config["SECRET_KEY"] = SECRET_KEY
    app.config["JWT_SECRET_KEY"] = SECRET_KEY
    
    CORS(app) # Allow all origins in dev
    JWTManager(app)
    
    # Imports
    from app.routes.auth import auth_bp
    from app.routes.tta_danhmuc_route import danhmuc_bp
    from app.routes.tta_sanpham_route import sanpham_bp
    from app.routes.tta_user_route import user_bp
    from app.routes.tta_donhang_route import donhang_bp
    from app.routes.tta_chitietdonhang_route import chitietdonhang_bp
    
    # Register blueprints with TTA prefix
    app.register_blueprint(auth_bp,           url_prefix="/api/tta_auth")
    app.register_blueprint(danhmuc_bp,        url_prefix="/api/tta_danhmuc")
    app.register_blueprint(sanpham_bp,        url_prefix="/api/tta_sanpham")
    app.register_blueprint(user_bp,           url_prefix="/api/tta_user")
    app.register_blueprint(donhang_bp,        url_prefix="/api/tta_donhang")
    app.register_blueprint(chitietdonhang_bp, url_prefix="/api/tta_chitiet_donhang")
    
    @app.route("/api/health")
    def health():
        return {"status": "ok"}
        
    return app
