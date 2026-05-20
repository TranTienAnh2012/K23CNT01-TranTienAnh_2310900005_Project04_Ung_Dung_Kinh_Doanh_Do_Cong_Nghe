from sqlalchemy import insert, update
from app.db.connection import engine
from app.models.schema import donhang, chitietdonhang, sanpham

def place_order(user_id, data):
    hoten = data.get('HoTenNguoiNhan') or data.get('HoTen') or ''
    sdt = data.get('SoDienThoaiNguoiNhan') or data.get('SoDienThoai') or data.get('SDT') or ''
    diachi = data.get('DiaChiNguoiNhan') or data.get('DiaChi') or ''
    email = data.get('EmailNguoiNhan') or data.get('Email') or ''
    tong_tien = data.get('TongTien') or 0
    ghichu = data.get('GhiChu') or ''
    payment_method = data.get('PhuongThucThanhToan') or 'COD'
    payment_status = data.get('TrangThaiThanhToan') or 'Unpaid'
    
    with engine.begin() as conn:
        # 1. Tạo đơn hàng trong G5_donhang
        stmt_order = insert(donhang).values(
            G5_MaNguoiDung=user_id,
            G5_HoTenNguoiNhan=hoten,
            G5_SoDienThoaiNguoiNhan=sdt,
            G5_DiaChiNguoiNhan=diachi,
            G5_EmailNguoiNhan=email,
            G5_TongTien=tong_tien,
            G5_GhiChu=ghichu,
            G5_PhuongThucThanhToan=payment_method,
            G5_TrangThaiThanhToan=payment_status,
            G5_TrangThai='Pending',
            G5_IsDeleted=0
        )
        result = conn.execute(stmt_order)
        order_id = result.lastrowid
        
        # 2. Tạo các chi tiết đơn hàng trong G5_chitietdonhang & Cập nhật số lượng tồn kho
        items = data.get('items') or []
        for item in items:
            ma_sp = item.get('MaSanPham') or item.get('G5_MaSanPham') or item.get('id')
            qty = item.get('SoLuong') or item.get('quantity') or 1
            if ma_sp:
                # Thêm vào chi tiết
                stmt_detail = insert(chitietdonhang).values(
                    G5_MaDonHang=order_id,
                    G5_MaSanPham=ma_sp,
                    G5_SoLuong=qty
                )
                conn.execute(stmt_detail)
                
                # Trừ số lượng tồn kho
                stmt_stock = update(sanpham).where(
                    sanpham.c.G5_MaSanPham == ma_sp
                ).values(
                    G5_SoLuongTon=sanpham.c.G5_SoLuongTon - qty
                )
                conn.execute(stmt_stock)
                
        return order_id
