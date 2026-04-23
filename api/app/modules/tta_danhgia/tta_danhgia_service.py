# Nghiệp vụ: Đánh giá sản phẩm là dữ liệu khách quan, admin chỉ có quyền quản lý (xem/xóa), không có quyền chỉnh sửa.
from app.modules.tta_danhgia import tta_danhgia_repo as repo

def get_all_reviews(params=None):
    return repo.get_all(params)

def create_review(data):
    return repo.create(data)

def delete_review(id):
    return repo.delete_review(id)
