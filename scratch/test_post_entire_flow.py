import sys
import os
from datetime import datetime

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

from app.db.connection import engine
from sqlalchemy import select, insert, update, text
from app.models.schema import donhang_thue, chitiet_donhang_thue, lich_su_thue, sanpham_thue

def test_flow():
    user_id = 1
    # Inputs similar to what frontend would send
    data = {
        'G5_NgayBatDau': '2026-05-31T08:00:00',
        'G5_NgayKetThuc': '2026-06-01T18:00:00',
        'G5_TongTien': 300000.0,
        'G5_TienCoc': 100000.0,
        'HoTenNguoiNhan': 'Tran Tien Anh',
        'SoDienThoaiNguoiNhan': '0345862097',
        'DiaChiNguoiNhan': 'Phú Lãm- Hà Đông - Hà Nội, Phường Phú Lãm, Quận Hà Đông, Thành phố Hà Nội',
        'EmailNguoiNhan': 'tienanhtran777@gmail.com',
        'GhiChu': 'Gọi cho tôi khi giao đến',
        'items': [
            {
                'G5_MaSanPham': 15, # Laptop Lenovo Gaming Legion 5 15IRX10
                'G5_SoLuong': 1,
                'G5_GiaThue': 300000.0
            }
        ]
    }

    ngay_bd_str = data.get('G5_NgayBatDau')
    ngay_kt_str = data.get('G5_NgayKetThuc')
    
    ngay_bd = datetime.fromisoformat(ngay_bd_str.replace('Z', '')) if ngay_bd_str else datetime.utcnow()
    ngay_kt = datetime.fromisoformat(ngay_kt_str.replace('Z', '')) if ngay_kt_str else datetime.utcnow()
        
    tong_tien = data.get('G5_TongTien') or 0
    tien_coc = data.get('G5_TienCoc') or 0
    items = data.get('items') or []
    
    hoten = data.get('HoTenNguoiNhan') or ''
    sdt = data.get('SoDienThoaiNguoiNhan') or ''
    diachi = data.get('DiaChiNguoiNhan') or ''
    email = data.get('EmailNguoiNhan') or ''
    ghichu = data.get('GhiChu') or data.get('G5_GhiChu') or ''
    
    print("Beginning transaction flow...")
    try:
        with engine.begin() as conn:
            # 1. Insert order
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
            print(f"Order inserted. ID: {order_id}")
            
            # 2. Insert items, update inventory, and log history
            for item in items:
                ma_sp = item.get('G5_MaSanPham') or item.get('MaSanPham')
                qty = item.get('G5_SoLuong') or item.get('SoLuong') or 1
                gia_thue = item.get('G5_GiaThue') or item.get('GiaThue') or 0
                
                print(f"Checking product availability for MaSanPham={ma_sp}...")
                # Validate product stock availability
                stmt_check_qty = select(sanpham_thue.c.G5_SoLuongChoThue).where(sanpham_thue.c.G5_MaSanPham == ma_sp)
                avail_row = conn.execute(stmt_check_qty).fetchone()
                if not avail_row:
                    raise ValueError(f"Sản phẩm ID {ma_sp} không tồn tại trong danh sách cho thuê.")
                
                available_qty = avail_row._mapping['G5_SoLuongChoThue']
                print(f"Available qty: {available_qty}, requested: {qty}")
                if available_qty < qty:
                    raise ValueError(f"Sản phẩm ID {ma_sp} không đủ số lượng cho thuê.")
                
                print("Inserting details...")
                stmt_detail = insert(chitiet_donhang_thue).values(
                    G5_MaDonThue=order_id,
                    G5_MaSanPham=ma_sp,
                    G5_SoLuong=qty,
                    G5_GiaThue=gia_thue
                )
                conn.execute(stmt_detail)
                
                print("Decreasing stock...")
                # Decrease stock quantity
                stmt_dec_stock = update(sanpham_thue).where(
                    sanpham_thue.c.G5_MaSanPham == ma_sp
                ).values(
                    G5_SoLuongChoThue=sanpham_thue.c.G5_SoLuongChoThue - qty
                )
                conn.execute(stmt_dec_stock)
                
                print("Inserting history...")
                # Insert rental history entry
                stmt_history = insert(lich_su_thue).values(
                    G5_MaSanPham=ma_sp,
                    G5_MaDonThue=order_id,
                    G5_TrangThai='Đã đặt',
                    G5_ThoiDiem=datetime.utcnow()
                )
                conn.execute(stmt_history)
            
            print("Flow succeeded! Rolling back transaction to keep DB clean...")
            raise RuntimeError("Rollback success")
    except Exception as e:
        print("Exception occurred:")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_flow()
