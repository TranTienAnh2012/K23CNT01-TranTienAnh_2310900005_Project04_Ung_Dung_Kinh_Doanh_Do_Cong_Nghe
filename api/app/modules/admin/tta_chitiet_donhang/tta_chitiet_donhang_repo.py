from sqlalchemy import select, insert, update, delete, func, text, or_
from app.db.connection import engine
from app.models.schema import chitietdonhang, sanpham, donhang

def get_all(params=None):
    stmt = select(
        chitietdonhang,
        sanpham.c.G5_TenSanPham,
        sanpham.c.G5_HinhAnh,
        sanpham.c.G5_GiaBan,
        donhang.c.G5_HoTenNguoiNhan,
        donhang.c.G5_NgayDatHang
    ).select_from(
        chitietdonhang.join(sanpham, chitietdonhang.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
        .join(donhang, chitietdonhang.c.G5_MaDonHang == donhang.c.G5_MaDonHang)
    )
    
    if params:
        if params.get("ma_don_hang"):
            stmt = stmt.where(chitietdonhang.c.G5_MaDonHang == params["ma_don_hang"])
        if params.get("q"):
            stmt = stmt.where(or_(
                sanpham.c.G5_TenSanPham.like(f"%{params['q']}%"),
                text("CAST(G5_chitietdonhang.G5_MaDonHang AS VARCHAR) LIKE :q").bindparams(q=f"%{params['q']}%")
            ))
    
    stmt = stmt.order_by(donhang.c.G5_NgayDatHang.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._asdict()
            items.append({
                "Id": row_dict['G5_MaChiTiet'],
                "MaDonHang": row_dict['G5_MaDonHang'],
                "MaSanPham": row_dict['G5_MaSanPham'],
                "SoLuong": row_dict['G5_SoLuong'],
                "TenSanPham": row_dict['G5_TenSanPham'],
                "HinhAnh": row_dict['G5_HinhAnh'],
                "DonGia": float(row_dict['G5_GiaBan']) if row_dict['G5_GiaBan'] is not None else 0,
                "ThanhTien": float(row_dict['G5_GiaBan'] * row_dict['G5_SoLuong']) if row_dict['G5_GiaBan'] is not None else 0,
                "HoTenNguoiNhan": row_dict['G5_HoTenNguoiNhan'],
                "NgayDatHang": row_dict['G5_NgayDatHang'].isoformat() if row_dict['G5_NgayDatHang'] else None
            })
        
        total = conn.execute(select(func.count()).select_from(chitietdonhang)).scalar()
        return {"items": items, "total": total}

def get_by_id(ma):
    stmt = select(
        chitietdonhang,
        sanpham.c.G5_TenSanPham,
        sanpham.c.G5_GiaBan
    ).select_from(
        chitietdonhang.join(sanpham, chitietdonhang.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
    ).where(chitietdonhang.c.G5_MaChiTiet == ma)
    
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
        row_dict = row._asdict()
        return {
            "Id": row_dict['G5_MaChiTiet'],
            "MaDonHang": row_dict['G5_MaDonHang'],
            "MaSanPham": row_dict['G5_MaSanPham'],
            "SoLuong": row_dict['G5_SoLuong'],
            "TenSanPham": row_dict['G5_TenSanPham'],
            "GiaBan": float(row_dict['G5_GiaBan']) if row_dict['G5_GiaBan'] is not None else 0
        }

def _recalculate_order_total(conn, order_id):
    # Recalculate total using GiaBan from sanpham since G5_Gia doesn't exist in DB
    sum_stmt = select(
        func.sum(chitietdonhang.c.G5_SoLuong * sanpham.c.G5_GiaBan)
    ).select_from(
        chitietdonhang.join(sanpham, chitietdonhang.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
    ).where(chitietdonhang.c.G5_MaDonHang == order_id)
    new_total = conn.execute(sum_stmt).scalar() or 0
    
    upd_stmt = update(donhang).where(donhang.c.G5_MaDonHang == order_id).values(G5_TongTien=new_total)
    conn.execute(upd_stmt)

def update_qty(ma, new_qty):
    with engine.begin() as conn:
        item_stmt = select(chitietdonhang.c.G5_MaDonHang, chitietdonhang.c.G5_MaSanPham, chitietdonhang.c.G5_SoLuong).where(chitietdonhang.c.G5_MaChiTiet == ma)
        item = conn.execute(item_stmt).fetchone()
        if not item: return False
        
        item_dict = item._asdict()
        diff = new_qty - item_dict['G5_SoLuong']
        
        # Update stock
        upd_sp = update(sanpham).where(sanpham.c.G5_MaSanPham == item_dict['G5_MaSanPham']).values(G5_SoLuongTon=sanpham.c.G5_SoLuongTon - diff)
        conn.execute(upd_sp)
        
        # Update detail qty
        upd_ct = update(chitietdonhang).where(chitietdonhang.c.G5_MaChiTiet == ma).values(G5_SoLuong=new_qty)
        conn.execute(upd_ct)
        
        _recalculate_order_total(conn, item_dict['G5_MaDonHang'])
        return True

def delete_detail(ma):
    with engine.begin() as conn:
        item_stmt = select(chitietdonhang.c.G5_MaDonHang, chitietdonhang.c.G5_MaSanPham, chitietdonhang.c.G5_SoLuong).where(chitietdonhang.c.G5_MaChiTiet == ma)
        item = conn.execute(item_stmt).fetchone()
        if not item: return False
        
        item_dict = item._asdict()
        
        # Restore stock
        upd_sp = update(sanpham).where(sanpham.c.G5_MaSanPham == item_dict['G5_MaSanPham']).values(G5_SoLuongTon=sanpham.c.G5_SoLuongTon + item_dict['G5_SoLuong'])
        conn.execute(upd_sp)
        
        # Delete detail
        del_stmt = delete(chitietdonhang).where(chitietdonhang.c.G5_MaChiTiet == ma)
        conn.execute(del_stmt)
        
        _recalculate_order_total(conn, item_dict['G5_MaDonHang'])
        return True
