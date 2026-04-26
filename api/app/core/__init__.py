from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_restful import Api
from app.core.config import get_config
from app.db.connection import engine

def create_app(config_name=None):
    app = Flask(__name__, static_folder='../../static', static_url_path='/static')

    # Initialize Flask-RESTful
    api = Api(app, catch_all_404s=True)

    # Load configuration
    config = get_config(config_name)
    app.config.from_object(config)

    # Initialize extensions
    CORS(app, origins=config.CORS_ORIGINS)
    JWTManager(app)

    # Register middleware
    register_middleware(app)

    # Register error handlers
    register_error_handlers(app)

    # Register resources
    register_resources(api)

    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "Backend standardized structure with Flask-RESTful and SQLAlchemy Core is fully operational!"}

    return app

def register_middleware(app):
    """Register middleware"""
    from app.middleware.request_middleware import request_logger_middleware
    request_logger_middleware(app)

def register_error_handlers(app):
    """Register error handlers"""
    from app.utils.error_handlers import (
        handle_400, handle_401, handle_403, handle_404,
        handle_500, handle_validation_error
    )

    app.register_error_handler(400, handle_400)
    app.register_error_handler(401, handle_401)
    app.register_error_handler(403, handle_403)
    app.register_error_handler(404, handle_404)
    app.register_error_handler(500, handle_500)
    app.register_error_handler(Exception, handle_validation_error)

def register_resources(api):
    """Register all Flask-RESTful resources"""
    # Auth resources
    from app.modules.auth.auth_resource import LoginResource
    api.add_resource(LoginResource, '/api/tta_auth/login')

    # SanPham resources
    from app.modules.tta_sanpham.tta_sanpham_resource import SanPhamListResource, SanPhamResource
    api.add_resource(SanPhamListResource, '/api/tta_sanpham')
    api.add_resource(SanPhamResource, '/api/tta_sanpham/<int:ma>')

    # DanhMuc resources
    from app.modules.tta_danhmuc.tta_danhmuc_resource import DanhMucListResource, DanhMucResource
    api.add_resource(DanhMucListResource, '/api/tta_danhmuc')
    api.add_resource(DanhMucResource, '/api/tta_danhmuc/<int:ma>')

    # NguoiDung resources
    from app.modules.tta_nguoidung.tta_nguoidung_resource import NguoiDungListResource, NguoiDungResource
    api.add_resource(NguoiDungListResource, '/api/tta_user')
    api.add_resource(NguoiDungResource, '/api/tta_user/<int:ma>')

    # DonHang resources
    from app.modules.tta_donhang.tta_donhang_resource import DonHangListResource, DonHangResource
    api.add_resource(DonHangListResource, '/api/tta_donhang')
    api.add_resource(DonHangResource, '/api/tta_donhang/<int:ma>')

    # ThuocTinh resources
    from app.modules.tta_thuoctinh.tta_thuoctinh_resource import ThuocTinhListResource, ThuocTinhResource
    api.add_resource(ThuocTinhListResource, '/api/tta_thuoctinh')
    api.add_resource(ThuocTinhResource, '/api/tta_thuoctinh/<int:ma>')

    # GiaTriThuocTinh resources
    from app.modules.tta_giatrithuoctinh.tta_giatrithuoctinh_resource import GiaTriThuocTinhListResource, GiaTriThuocTinhResource
    api.add_resource(GiaTriThuocTinhListResource, '/api/tta_giatrithuoctinh')
    api.add_resource(GiaTriThuocTinhResource, '/api/tta_giatrithuoctinh/<int:id>')

    # DanhMucThuocTinh resources
    from app.modules.tta_danhmuc_thuoctinh.tta_danhmuc_thuoctinh_resource import DanhMucThuocTinhListResource, DanhMucThuocTinhResource, ProductAttributeResource
    api.add_resource(DanhMucThuocTinhListResource, '/api/tta_danhmuc_thuoctinh')
    api.add_resource(DanhMucThuocTinhResource, '/api/tta_danhmuc_thuoctinh/<int:id>')
    api.add_resource(ProductAttributeResource, '/api/tta_danhmuc_thuoctinh/product/<int:ma_sp>')

    # ChiTietDonHang resources
    from app.modules.tta_chitiet_donhang.tta_chitiet_donhang_resource import ChiTietDonHangListResource, ChiTietDonHangResource
    api.add_resource(ChiTietDonHangListResource, '/api/tta_chitiet_donhang')
    api.add_resource(ChiTietDonHangResource, '/api/tta_chitiet_donhang/<int:ma>')

    # Review (danhgia) resources
    from app.modules.tta_danhgia.tta_danhgia_resource import ReviewListResource, ReviewResource
    api.add_resource(ReviewListResource, '/api/tta_danhgia')
    api.add_resource(ReviewResource, '/api/tta_danhgia/<int:id>')

    # Voucher resources
    from app.modules.tta_voucher.tta_voucher_resource import VoucherListResource, VoucherResource
    api.add_resource(VoucherListResource, '/api/tta_voucher')
    api.add_resource(VoucherResource, '/api/tta_voucher/<int:id>')

    # TODO: Register other resources as they are refactored
    
    # We still keep blueprints for non-RESTful routes or legacy support if needed
    # but the goal is to migrate them all.
