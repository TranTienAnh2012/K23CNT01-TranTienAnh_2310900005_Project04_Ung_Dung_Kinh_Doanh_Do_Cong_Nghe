from flask import Blueprint, request
from app.modules.tta_sanpham import tta_sanpham_service as service
from app.utils.helpers import response_success, response_error

# Blueprint cho các chức năng Client của Sản phẩm (Xem công khai)
sanpham_client_bp = Blueprint("sanpham_client", __name__)

@sanpham_client_bp.route("", methods=["GET"])
def get_all():
    params = request.args.to_dict()
    data = service.get_all_products(params)
    return response_success(data=data)

@sanpham_client_bp.route("/<int:ma>", methods=["GET"])
def get_one(ma):
    data = service.get_product_detail(ma)
    if not data:
        return response_error("Sản phẩm không tồn tại.", 404)
    return response_success(data=data)
