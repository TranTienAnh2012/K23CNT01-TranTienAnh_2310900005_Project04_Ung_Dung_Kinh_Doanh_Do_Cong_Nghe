from flask import Blueprint, request
from app.modules.tta_danhmuc import tta_danhmuc_service as service
from app.utils.helpers import response_success

danhmuc_client_bp = Blueprint("danhmuc_client", __name__)

@danhmuc_client_bp.route("", methods=["GET"])
def get_all():
    params = request.args.to_dict()
    data = service.get_all_categories(params)
    return response_success(data=data)
