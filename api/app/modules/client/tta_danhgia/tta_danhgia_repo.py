from sqlalchemy import select, insert, and_, func
from app.db.connection import engine
from app.models.schema import danhgia, donhang, chitietdonhang, user

def get_product_reviews(ma_sp):
    stmt = select(
        danhgia.c.G5_MaDanhGia,
        danhgia.c.G5_SoSao,
        danhgia.c.G5_BinhLuan,
        danhgia.c.G5_NgayDanhGia,
        user.c.G5_HoTen,
        user.c.G5_Email
    ).select_from(
        danhgia.join(user, danhgia.c.G5_MaNguoiDung == user.c.G5_MaNguoiDung)
    ).where(
        danhgia.c.G5_MaSanPham == ma_sp
    ).order_by(danhgia.c.G5_NgayDanhGia.desc())

    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        total_stars = 0
        for row in result:
            row_dict = row._mapping
            items.append({
                "MaDanhGia": row_dict['G5_MaDanhGia'],
                "SoSao": row_dict['G5_SoSao'],
                "BinhLuan": row_dict['G5_BinhLuan'],
                "NgayDanhGia": row_dict['G5_NgayDanhGia'].isoformat() if row_dict['G5_NgayDanhGia'] else None,
                "HoTen": row_dict['G5_HoTen'] or row_dict['G5_Email'] or "Khách hàng"
            })
            total_stars += row_dict['G5_SoSao'] or 0
        
        avg_stars = round(total_stars / len(items), 1) if items else 0
        return {
            "items": items,
            "total": len(items),
            "average_stars": avg_stars
        }

def check_can_review(user_id, ma_sp):
    # 1. Check if user purchased the product
    stmt_purchased = select(donhang.c.G5_MaDonHang).select_from(
        donhang.join(chitietdonhang, donhang.c.G5_MaDonHang == chitietdonhang.c.G5_MaDonHang)
    ).where(
        donhang.c.G5_MaNguoiDung == user_id,
        donhang.c.G5_IsDeleted == 0,
        chitietdonhang.c.G5_MaSanPham == ma_sp
    )
    
    # 2. Check if user already reviewed
    stmt_reviewed = select(danhgia.c.G5_MaDanhGia).where(
        danhgia.c.G5_MaNguoiDung == user_id,
        danhgia.c.G5_MaSanPham == ma_sp
    )

    with engine.connect() as conn:
        purchased_row = conn.execute(stmt_purchased).fetchone()
        reviewed_row = conn.execute(stmt_reviewed).fetchone()
        
        has_purchased = purchased_row is not None
        has_reviewed = reviewed_row is not None
        
        return has_purchased and not has_reviewed

def create_review(user_id, data):
    ma_sp = data.get('MaSanPham')
    so_sao = data.get('SoSao')
    binh_luan = data.get('BinhLuan') or ''
    
    stmt = insert(danhgia).values(
        G5_MaSanPham=ma_sp,
        G5_MaNguoiDung=user_id,
        G5_SoSao=so_sao,
        G5_BinhLuan=binh_luan,
        G5_NgayDanhGia=func.now()
    )
    with engine.begin() as conn:
        conn.execute(stmt)
