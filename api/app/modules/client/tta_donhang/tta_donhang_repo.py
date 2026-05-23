from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import donhang, chitietdonhang, sanpham, giohangtam

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
        order_id = result.inserted_primary_key[0]
        
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

                # Xóa khỏi giỏ hàng tạm
                stmt_del_cart = delete(giohangtam).where(
                    giohangtam.c.G5_MaNguoiDung == user_id,
                    giohangtam.c.G5_MaSanPham == ma_sp
                )
                conn.execute(stmt_del_cart)
                
        return order_id

def get_orders_by_user(user_id):
    stmt = select(donhang).where(donhang.c.G5_MaNguoiDung == user_id, donhang.c.G5_IsDeleted == 0).order_by(donhang.c.G5_NgayDatHang.desc())
    with engine.connect() as conn:
        result = conn.execute(stmt).fetchall()
        orders = []
        for row in result:
            row_dict = row._mapping
            order_id = row_dict['G5_MaDonHang']
            
            # Lấy danh sách sản phẩm trong đơn hàng
            stmt_items = select(
                chitietdonhang.c.G5_SoLuong,
                sanpham.c.G5_MaSanPham,
                sanpham.c.G5_TenSanPham,
                sanpham.c.G5_HinhAnh,
                sanpham.c.G5_GiaBan
            ).select_from(
                chitietdonhang.join(sanpham, chitietdonhang.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
            ).where(chitietdonhang.c.G5_MaDonHang == order_id)
            
            items_res = conn.execute(stmt_items)
            items = []
            for item_row in items_res:
                item_dict = item_row._mapping
                items.append({
                    "MaSanPham": item_dict['G5_MaSanPham'],
                    "TenSanPham": item_dict['G5_TenSanPham'],
                    "HinhAnh": item_dict['G5_HinhAnh'],
                    "GiaBan": float(item_dict['G5_GiaBan']) if item_dict['G5_GiaBan'] else 0,
                    "SoLuong": item_dict['G5_SoLuong']
                })
                
            orders.append({
                "MaDonHang": order_id,
                "NgayDatHang": row_dict['G5_NgayDatHang'].isoformat() if row_dict['G5_NgayDatHang'] else None,
                "TongTien": float(row_dict['G5_TongTien']) if row_dict['G5_TongTien'] else 0,
                "TrangThai": row_dict['G5_TrangThai'],
                "HoTenNguoiNhan": row_dict['G5_HoTenNguoiNhan'],
                "SoDienThoai": row_dict['G5_SoDienThoaiNguoiNhan'],
                "DiaChi": row_dict['G5_DiaChiNguoiNhan'],
                "Email": row_dict['G5_EmailNguoiNhan'],
                "PhuongThucThanhToan": row_dict['G5_PhuongThucThanhToan'],
                "TrangThaiThanhToan": row_dict['G5_TrangThaiThanhToan'],
                "GhiChu": row_dict['G5_GhiChu'],
                "items": items
            })
        return orders

def get_order_by_id(user_id, order_id):
    stmt = select(donhang).where(
        donhang.c.G5_MaDonHang == order_id,
        donhang.c.G5_MaNguoiDung == user_id,
        donhang.c.G5_IsDeleted == 0
    )
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
        row_dict = row._mapping
        
        # Lấy danh sách sản phẩm trong đơn hàng
        stmt_items = select(
            chitietdonhang.c.G5_SoLuong,
            sanpham.c.G5_MaSanPham,
            sanpham.c.G5_TenSanPham,
            sanpham.c.G5_HinhAnh,
            sanpham.c.G5_GiaBan
        ).select_from(
            chitietdonhang.join(sanpham, chitietdonhang.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
        ).where(chitietdonhang.c.G5_MaDonHang == order_id)
        
        items_res = conn.execute(stmt_items).fetchall()
        items = []
        for item_row in items_res:
            item_dict = item_row._mapping
            items.append({
                "MaSanPham": item_dict['G5_MaSanPham'],
                "TenSanPham": item_dict['G5_TenSanPham'],
                "HinhAnh": item_dict['G5_HinhAnh'],
                "GiaBan": float(item_dict['G5_GiaBan']) if item_dict['G5_GiaBan'] else 0,
                "SoLuong": item_dict['G5_SoLuong']
            })
            
        return {
            "MaDonHang": order_id,
            "NgayDatHang": row_dict['G5_NgayDatHang'].isoformat() if row_dict['G5_NgayDatHang'] else None,
            "TongTien": float(row_dict['G5_TongTien']) if row_dict['G5_TongTien'] else 0,
            "TrangThai": row_dict['G5_TrangThai'],
            "HoTenNguoiNhan": row_dict['G5_HoTenNguoiNhan'],
            "SoDienThoai": row_dict['G5_SoDienThoaiNguoiNhan'],
            "DiaChi": row_dict['G5_DiaChiNguoiNhan'],
            "Email": row_dict['G5_EmailNguoiNhan'],
            "PhuongThucThanhToan": row_dict['G5_PhuongThucThanhToan'],
            "TrangThaiThanhToan": row_dict['G5_TrangThaiThanhToan'],
            "GhiChu": row_dict['G5_GhiChu'],
            "items": items
        }

def cancel_order(user_id, order_id):
    # Xác thực xem đơn hàng có thuộc quyền sở hữu của user và ở trạng thái Chờ xử lý/Chờ xác nhận không
    stmt_check = select(donhang.c.G5_TrangThai).where(
        donhang.c.G5_MaDonHang == order_id,
        donhang.c.G5_MaNguoiDung == user_id,
        donhang.c.G5_IsDeleted == 0
    )
    with engine.begin() as conn:
        row = conn.execute(stmt_check).fetchone()
        if not row:
            return False
            
        status = row._mapping['G5_TrangThai']
        if status not in ['Pending', 'Chờ xử lý', 'Chờ xác nhận']:
            return False
            
        # Cập nhật trạng thái đơn hàng thành Cancelled
        stmt_cancel = update(donhang).where(
            donhang.c.G5_MaDonHang == order_id
        ).values(G5_TrangThai='Cancelled')
        conn.execute(stmt_cancel)
        
        # Hoàn trả số lượng tồn kho cho các sản phẩm
        stmt_items = select(chitietdonhang.c.G5_MaSanPham, chitietdonhang.c.G5_SoLuong).where(
            chitietdonhang.c.G5_MaDonHang == order_id
        )
        items = conn.execute(stmt_items).fetchall()
        for item in items:
            conn.execute(
                update(sanpham).where(
                    sanpham.c.G5_MaSanPham == item._mapping['G5_MaSanPham']
                ).values(
                    G5_SoLuongTon=sanpham.c.G5_SoLuongTon + item._mapping['G5_SoLuong']
                )
            )
            
        return True
