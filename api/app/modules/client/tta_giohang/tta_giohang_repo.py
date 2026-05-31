from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import giohangtam, sanpham

def get_by_user_id(user_id):
    stmt = select(
        giohangtam.c.G5_Id,
        giohangtam.c.G5_MaNguoiDung,
        giohangtam.c.G5_MaSanPham,
        giohangtam.c.G5_SoLuong,
        sanpham.c.G5_TenSanPham,
        sanpham.c.G5_HinhAnh,
        sanpham.c.G5_GiaBan,
        sanpham.c.G5_SoLuongTon
    ).select_from(
        giohangtam.join(sanpham, giohangtam.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
    ).where(
        giohangtam.c.G5_MaNguoiDung == user_id
    ).order_by(giohangtam.c.G5_Id.desc())

    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._mapping
            items.append({
                "Id": row_dict['G5_Id'],
                "MaNguoiDung": row_dict['G5_MaNguoiDung'],
                "MaSanPham": row_dict['G5_MaSanPham'],
                "SoLuong": row_dict['G5_SoLuong'],
                "TenSanPham": row_dict['G5_TenSanPham'],
                "HinhAnh": row_dict['G5_HinhAnh'],
                "GiaBan": float(row_dict['G5_GiaBan']) if row_dict['G5_GiaBan'] else 0,
                "SoLuongTon": row_dict['G5_SoLuongTon']
            })
        return items

def add_to_cart(user_id, data):
    ma_sp = data.get('MaSanPham')
    qty = data.get('SoLuong') or 1

    # Check if item already exists in user's cart
    stmt_check = select(giohangtam).where(
        giohangtam.c.G5_MaNguoiDung == user_id,
        giohangtam.c.G5_MaSanPham == ma_sp
    )
    with engine.connect() as conn:
        row = conn.execute(stmt_check).fetchone()
        if row:
            # Update quantity
            new_qty = row._mapping['G5_SoLuong'] + qty
            stmt_update = update(giohangtam).where(
                giohangtam.c.G5_Id == row._mapping['G5_Id']
            ).values(G5_SoLuong=new_qty)
            with engine.begin() as transaction_conn:
                transaction_conn.execute(stmt_update)
            return row._mapping['G5_Id']
        else:
            # Insert new
            stmt_insert = insert(giohangtam).values(
                G5_MaNguoiDung=user_id,
                G5_MaSanPham=ma_sp,
                G5_SoLuong=qty
            )
            with engine.begin() as transaction_conn:
                res = transaction_conn.execute(stmt_insert)
                new_id = res.inserted_primary_key[0]
            return new_id

def update_quantity(id, user_id, qty):
    stmt = update(giohangtam).where(
        giohangtam.c.G5_Id == id,
        giohangtam.c.G5_MaNguoiDung == user_id
    ).values(G5_SoLuong=qty)
    with engine.begin() as conn:
        conn.execute(stmt)

def delete_item(id, user_id):
    stmt = delete(giohangtam).where(
        giohangtam.c.G5_Id == id,
        giohangtam.c.G5_MaNguoiDung == user_id
    )
    with engine.begin() as conn:
        conn.execute(stmt)
