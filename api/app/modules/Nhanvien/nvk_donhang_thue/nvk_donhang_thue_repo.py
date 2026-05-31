from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import donhang_thue

import datetime
import decimal

def serialize_row(row_dict):
    if not row_dict:
        return None
    new_dict = {}
    for k, v in row_dict.items():
        if isinstance(v, (datetime.datetime, datetime.date)):
            new_dict[k] = v.isoformat()
        elif isinstance(v, decimal.Decimal):
            new_dict[k] = float(v)
        else:
            new_dict[k] = v
    return new_dict

def get_all(params=None):
    from app.models.schema import user, chitiet_donhang_thue, sanpham
    
    stmt = select(
        donhang_thue.c.G5_MaDonThue,
        donhang_thue.c.G5_MaNguoiDung,
        donhang_thue.c.G5_NgayBatDau,
        donhang_thue.c.G5_NgayKetThuc,
        donhang_thue.c.G5_TongTien,
        donhang_thue.c.G5_TrangThai,
        donhang_thue.c.G5_TienCoc,
        donhang_thue.c.G5_TrangThaiThanhToan,
        donhang_thue.c.G5_NgayTraThucTe,
        donhang_thue.c.G5_HoTenNguoiNhan,
        donhang_thue.c.G5_SoDienThoaiNguoiNhan,
        donhang_thue.c.G5_DiaChiNguoiNhan,
        donhang_thue.c.G5_EmailNguoiNhan,
        user.c.G5_HoTen,
        user.c.G5_Email,
        user.c.G5_SDT
    ).select_from(
        donhang_thue.outerjoin(user, donhang_thue.c.G5_MaNguoiDung == user.c.G5_MaNguoiDung)
    )
    
    if 'G5_IsDeleted' in [c.name for c in donhang_thue.columns]:
        stmt = stmt.where(donhang_thue.c.G5_IsDeleted == 0)
        
    stmt = stmt.order_by(donhang_thue.c.G5_MaDonThue.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt).fetchall()
        items = []
        for row in result:
            row_dict = serialize_row(dict(row._mapping))
            order_id = row_dict['G5_MaDonThue']
            
            # Fetch nested items
            stmt_details = select(
                chitiet_donhang_thue.c.G5_SoLuong,
                chitiet_donhang_thue.c.G5_GiaThue,
                sanpham.c.G5_MaSanPham,
                sanpham.c.G5_TenSanPham,
                sanpham.c.G5_HinhAnh
            ).select_from(
                chitiet_donhang_thue.join(sanpham, chitiet_donhang_thue.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
            ).where(chitiet_donhang_thue.c.G5_MaDonThue == order_id)
            
            details_res = conn.execute(stmt_details)
            details = [serialize_row(dict(d_row._mapping)) for d_row in details_res]
            row_dict['items'] = details
            items.append(row_dict)
            
        return {"items": items, "total": len(items)}

def get_by_id(id):
    from app.models.schema import user, chitiet_donhang_thue, sanpham
    
    stmt = select(
        donhang_thue.c.G5_MaDonThue,
        donhang_thue.c.G5_MaNguoiDung,
        donhang_thue.c.G5_NgayBatDau,
        donhang_thue.c.G5_NgayKetThuc,
        donhang_thue.c.G5_TongTien,
        donhang_thue.c.G5_TrangThai,
        donhang_thue.c.G5_TienCoc,
        donhang_thue.c.G5_TrangThaiThanhToan,
        donhang_thue.c.G5_NgayTraThucTe,
        donhang_thue.c.G5_HoTenNguoiNhan,
        donhang_thue.c.G5_SoDienThoaiNguoiNhan,
        donhang_thue.c.G5_DiaChiNguoiNhan,
        donhang_thue.c.G5_EmailNguoiNhan,
        user.c.G5_HoTen,
        user.c.G5_Email,
        user.c.G5_SDT
    ).select_from(
        donhang_thue.outerjoin(user, donhang_thue.c.G5_MaNguoiDung == user.c.G5_MaNguoiDung)
    ).where(donhang_thue.c.G5_MaDonThue == id)
    
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
        row_dict = serialize_row(dict(row._mapping))
        
        # Fetch nested items
        stmt_details = select(
            chitiet_donhang_thue.c.G5_SoLuong,
            chitiet_donhang_thue.c.G5_GiaThue,
            sanpham.c.G5_MaSanPham,
            sanpham.c.G5_TenSanPham,
            sanpham.c.G5_HinhAnh
        ).select_from(
            chitiet_donhang_thue.join(sanpham, chitiet_donhang_thue.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
        ).where(chitiet_donhang_thue.c.G5_MaDonThue == id)
        
        details_res = conn.execute(stmt_details)
        details = [serialize_row(dict(d_row._mapping)) for d_row in details_res]
        row_dict['items'] = details
        return row_dict

def create(data):
    stmt = insert(donhang_thue).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_item(id, data):
    from app.models.schema import chitiet_donhang_thue, lich_su_thue, sanpham_thue
    
    # 1. Fetch current/old status
    stmt_old = select(donhang_thue.c.G5_TrangThai).where(donhang_thue.c.G5_MaDonThue == id)
    with engine.begin() as conn:
        old_row = conn.execute(stmt_old).fetchone()
        old_status = old_row._mapping['G5_TrangThai'] if old_row else None
        
        # 2. Filter input data to only columns present in G5_donhang_thue (excluding primary keys)
        valid_cols = [c.name for c in donhang_thue.columns if not c.primary_key]
        filtered_data = {k: v for k, v in data.items() if k in valid_cols}
        
        new_status = filtered_data.get('G5_TrangThai')
        if new_status == 'Đang thuê':
            filtered_data['G5_TrangThaiThanhToan'] = 'Đã thanh toán tiền cọc'
        elif new_status == 'Đã trả':
            filtered_data['G5_TrangThaiThanhToan'] = 'Đã thanh toán'
            
        # 3. Update the order
        stmt = update(donhang_thue).where(donhang_thue.c.G5_MaDonThue == id).values(**filtered_data)
        conn.execute(stmt)
        
        # 4. Handle inventory transitions if status changes
        new_status = filtered_data.get('G5_TrangThai')
        if new_status and new_status != old_status:
            # Fetch products and quantities in this order
            stmt_details = select(
                chitiet_donhang_thue.c.G5_MaSanPham,
                chitiet_donhang_thue.c.G5_SoLuong
            ).where(
                chitiet_donhang_thue.c.G5_MaDonThue == id
            )
            p_rows = conn.execute(stmt_details).fetchall()
            
            # Check old vs new status properties
            was_active = old_status in [None, 'Chờ xác nhận', 'Đang thuê', 'Đã duyệt', 'Pending', 'Active', 'Approved']
            is_active = new_status in ['Chờ xác nhận', 'Đang thuê', 'Đã duyệt', 'Pending', 'Active', 'Approved']
            
            for p_row in p_rows:
                ma_sp = p_row._mapping['G5_MaSanPham']
                qty = p_row._mapping['G5_SoLuong']
                
                # If active order becomes inactive (returned or cancelled), restore inventory
                if was_active and not is_active:
                    stmt_inc = update(sanpham_thue).where(
                        sanpham_thue.c.G5_MaSanPham == ma_sp
                    ).values(
                        G5_SoLuongChoThue=sanpham_thue.c.G5_SoLuongChoThue + qty
                    )
                    conn.execute(stmt_inc)
                # If inactive order becomes active, decrease inventory
                elif not was_active and is_active:
                    stmt_dec = update(sanpham_thue).where(
                        sanpham_thue.c.G5_MaSanPham == ma_sp
                    ).values(
                        G5_SoLuongChoThue=sanpham_thue.c.G5_SoLuongChoThue - qty
                    )
                    conn.execute(stmt_dec)
                    
                # Log to history
                stmt_history = insert(lich_su_thue).values(
                    G5_MaSanPham=ma_sp,
                    G5_MaDonThue=id,
                    G5_TrangThai=new_status,
                    G5_ThoiDiem=datetime.datetime.utcnow()
                )
                conn.execute(stmt_history)

def delete_item(id):
    if 'G5_IsDeleted' in [c.name for c in donhang_thue.columns]:
        stmt = update(donhang_thue).where(donhang_thue.c.G5_MaDonThue == id).values(G5_IsDeleted=1)
    else:
        stmt = delete(donhang_thue).where(donhang_thue.c.G5_MaDonThue == id)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
