import os
from dotenv import load_dotenv

# Tự động tìm và nạp tất cả biến số từ file .env vào hệ thống của Python
load_dotenv()

class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv("SECRET_KEY", "default-key-change-in-production")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    PROPAGATE_EXCEPTIONS = True

    # Cấu hình Database
    # os.getenv() sẽ tìm và đọc các giá trị tương ứng từ file .env đã nạp ở trên
    DB_SERVER = os.getenv("DB_SERVER", "localhost")
    DB_NAME = os.getenv("DB_NAME", "G5_KD_DO_CONG_NGHE")
    DB_USER = os.getenv("DB_USER") # VD: Lấy chữ 'TtaAdmin' từ file .env
    DB_PASS = os.getenv("DB_PASS") # Lấy mật khẩu từ file .env
    DB_TRUSTED = "yes" if not DB_USER else "no"

    # JWT
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600))

    # Upload
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "static/uploads")
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", 16 * 1024 * 1024))  # 16MB

    # CORS
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    DB_NAME = os.getenv("TEST_DB_NAME", "G5_KD_DO_CONG_NGHE_TEST")

config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config(config_name=None):
    """Get configuration by name"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    return config_by_name.get(config_name, DevelopmentConfig)

