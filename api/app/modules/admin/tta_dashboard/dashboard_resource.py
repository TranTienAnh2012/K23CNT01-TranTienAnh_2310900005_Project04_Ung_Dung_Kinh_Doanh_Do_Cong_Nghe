from flask_restful import Resource
from app.utils.helpers import response_success, response_error
from .dashboard_service import get_dashboard_summary

class DashboardResource(Resource):
    def get(self):
        """API lấy tổng quan dữ liệu dashboard"""
        try:
            data = get_dashboard_summary()
            return response_success(data=data, message="Dashboard data retrieved successfully")
        except Exception as e:
            return response_error(message=str(e), status=500)
