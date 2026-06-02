# Chỉ export create_app, KHÔNG gọi create_app() ở đây
# Việc gọi create_app() ở đây sẽ khiến Flask app bị khởi tạo 2 lần (lần 2 ở run.py)
# Điều này gây xung đột JWT: token được tạo bởi app1 nhưng xác thực bởi app2 -> 422
from app.core import create_app
