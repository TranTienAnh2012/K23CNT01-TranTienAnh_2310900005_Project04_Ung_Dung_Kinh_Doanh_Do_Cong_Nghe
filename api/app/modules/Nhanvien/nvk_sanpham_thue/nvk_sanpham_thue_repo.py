from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import sanpham_thue, sanpham

def get_all(params=None):
    stmt = select(
        sanpham_thue.c.G5_Id,
        sanpham_thue.c.G5_MaSanPham,
        sanpham_thue.c.G5_GiaThueNgay,
        sanpham_thue.c.G5_GiaThueGio,
        sanpham_thue.c.G5_SoLuongChoThue,
        sanpham_thue.c.G5_TienCoc,
        sanpham.c.G5_TenSanPham,
        sanpham.c.G5_HinhAnh
    ).select_from(
        sanpham_thue.join(sanpham, sanpham_thue.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
    )
    
    if params and params.get('q'):
        pass
        
    if 'G5_IsDeleted' in [c.name for c in sanpham_thue.columns]:
        stmt = stmt.where(sanpham_thue.c.G5_IsDeleted == 0)
        
    stmt = stmt.order_by(sanpham_thue.c.G5_Id.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        import decimal
        for row in result:
            item_dict = dict(row._mapping)
            for k, v in item_dict.items():
                if isinstance(v, decimal.Decimal):
                    item_dict[k] = float(v)
            items.append(item_dict)
        return {"items": items, "total": len(items)}

def get_by_id(id):
    stmt = select(
        sanpham_thue.c.G5_Id,
        sanpham_thue.c.G5_MaSanPham,
        sanpham_thue.c.G5_GiaThueNgay,
        sanpham_thue.c.G5_GiaThueGio,
        sanpham_thue.c.G5_SoLuongChoThue,
        sanpham_thue.c.G5_TienCoc,
        sanpham.c.G5_TenSanPham,
        sanpham.c.G5_HinhAnh
    ).select_from(
        sanpham_thue.join(sanpham, sanpham_thue.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
    ).where(sanpham_thue.c.G5_Id == id)
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
        import decimal
        item_dict = dict(row._mapping)
        for k, v in item_dict.items():
            if isinstance(v, decimal.Decimal):
                item_dict[k] = float(v)
        return item_dict

def create(data):
    cleaned_data = {}
    cols = [c.name for c in sanpham_thue.columns if c.name != 'G5_Id']
    for k in cols:
        if k in data and data[k] is not None and str(data[k]).strip() != '':
            if k in ['G5_MaSanPham', 'G5_SoLuongChoThue']:
                cleaned_data[k] = int(data[k])
            elif k in ['G5_GiaThueNgay', 'G5_GiaThueGio', 'G5_TienCoc']:
                cleaned_data[k] = float(data[k])
            else:
                cleaned_data[k] = data[k]
    stmt = insert(sanpham_thue).values(**cleaned_data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_item(id, data):
    cleaned_data = {}
    cols = [c.name for c in sanpham_thue.columns if c.name != 'G5_Id']
    for k in cols:
        if k in data:
            if data[k] is None or str(data[k]).strip() == '':
                cleaned_data[k] = None
            elif k in ['G5_MaSanPham', 'G5_SoLuongChoThue']:
                cleaned_data[k] = int(data[k])
            elif k in ['G5_GiaThueNgay', 'G5_GiaThueGio', 'G5_TienCoc']:
                cleaned_data[k] = float(data[k])
            else:
                cleaned_data[k] = data[k]
    stmt = update(sanpham_thue).where(sanpham_thue.c.G5_Id == id).values(**cleaned_data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_item(id):
    if 'G5_IsDeleted' in [c.name for c in sanpham_thue.columns]:
        stmt = update(sanpham_thue).where(sanpham_thue.c.G5_Id == id).values(G5_IsDeleted=1)
    else:
        stmt = delete(sanpham_thue).where(sanpham_thue.c.G5_Id == id)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
