import sys
import os
from datetime import datetime

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

from app.db.connection import engine
from sqlalchemy import select, insert, update, text
from app.models.schema import donhang_thue, chitiet_donhang_thue, lich_su_thue, sanpham_thue

def test():
    user_id = 1
    ngay_bd = datetime.strptime("2026-05-31T08:00:00", "%Y-%m-%dT%H:%M:%S")
    ngay_kt = datetime.strptime("2026-06-01T18:00:00", "%Y-%m-%dT%H:%M:%S")
    tong_tien = 300000.0
    tien_coc = 100000.0
    hoten = "Tran Tien Anh"
    sdt = "0345862097"
    diachi = "Phú Lãm- Hà Đông - Hà Nội, Phường Phú Lãm, Quận Hà Đông, Thành phố Hà Nội"
    email = "tienanhtran777@gmail.com"
    ghichu = "Gọi cho tôi khi giao đến"

    print("Trying insert...")
    try:
        with engine.begin() as conn:
            stmt_order = insert(donhang_thue).values(
                G5_MaNguoiDung=int(user_id),
                G5_NgayBatDau=ngay_bd,
                G5_NgayKetThuc=ngay_kt,
                G5_TongTien=tong_tien,
                G5_TienCoc=tien_coc,
                G5_TrangThai='Chờ xác nhận',
                G5_TrangThaiThanhToan='Chưa thanh toán',
                G5_HoTenNguoiNhan=hoten,
                G5_SoDienThoaiNguoiNhan=sdt,
                G5_DiaChiNguoiNhan=diachi,
                G5_EmailNguoiNhan=email,
                G5_GhiChu=ghichu,
                G5_IsDeleted=0
            )
            res_order = conn.execute(stmt_order)
            order_id = res_order.inserted_primary_key[0]
            print("Successfully inserted! New Order ID:", order_id)
            
            # Rollback automatically by not committing (or raise exception to test rollback)
            raise RuntimeError("Rollback test")
    except Exception as e:
        print("Error details:")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test()
