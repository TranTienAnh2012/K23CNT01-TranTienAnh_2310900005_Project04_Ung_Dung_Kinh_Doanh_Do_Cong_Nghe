import time
import logging
from flask import request, g
from functools import wraps

logger = logging.getLogger(__name__)

def request_logger_middleware(app):
    """Middleware to log all requests"""
    @app.before_request
    def before_request():
        g.start_time = time.time()
        logger.info(f"Request: {request.method} {request.path}")

    @app.after_request
    def after_request(response):
        if hasattr(g, 'start_time'):
            elapsed = time.time() - g.start_time
            logger.info(f"Response: {request.method} {request.path} - {response.status_code} - {elapsed:.3f}s")
        return response

    return app

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from flask_jwt_extended import get_jwt
        from app.utils.helpers import response_error

        claims = get_jwt()
        if claims.get("vai_tro") != "admin":
            return response_error("Không có quyền truy cập.", 403)
        return f(*args, **kwargs)
    return decorated_function

def rate_limit_middleware():
    """Simple rate limiting middleware"""
    from collections import defaultdict
    from datetime import datetime, timedelta

    request_counts = defaultdict(list)

    def check_rate_limit(ip_address, limit=100, window=60):
        now = datetime.now()
        cutoff = now - timedelta(seconds=window)

        request_counts[ip_address] = [
            timestamp for timestamp in request_counts[ip_address]
            if timestamp > cutoff
        ]

        if len(request_counts[ip_address]) >= limit:
            return False

        request_counts[ip_address].append(now)
        return True

    return check_rate_limit
