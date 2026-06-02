from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import voucher

def get_all(params=None):
    stmt = select(voucher)
    
    if params and params.get('q'):
        stmt = stmt.where(voucher.c.G5_Code.like(f"%{params['q']}%"))
    
    stmt = stmt.order_by(voucher.c.G5_CreatedAt.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._asdict()
            items.append({
                "Id": row_dict['G5_Id'],
                "Name": row_dict['G5_Name'],
                "Code": row_dict['G5_Code'],
                "DiscountType": row_dict['G5_DiscountType'],
                "DiscountValue": float(row_dict['G5_DiscountValue']) if row_dict['G5_DiscountValue'] else 0,
                "MinOrderValue": float(row_dict['G5_MinOrderValue']) if row_dict['G5_MinOrderValue'] else 0,
                "MaxDiscount": float(row_dict['G5_MaxDiscount']) if row_dict['G5_MaxDiscount'] else 0,
                "StartDate": row_dict['G5_StartDate'].isoformat() if row_dict['G5_StartDate'] else None,
                "EndDate": row_dict['G5_EndDate'].isoformat() if row_dict['G5_EndDate'] else None,
                "Status": row_dict['G5_Status'],
                "TotalQuantity": row_dict['G5_TotalQuantity'],
                "UsedQuantity": row_dict['G5_UsedQuantity']
            })
        return {"items": items, "total": len(items)}

def get_by_id(id):
    stmt = select(voucher).where(voucher.c.G5_Id == id)
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row: return None
        return row._asdict()

from datetime import datetime

def create(data):
    # Helper to parse ISO dates from frontend (e.g., "2024-05-23T23:36")
    def parse_date(date_str):
        if not date_str: return None
        try:
            # Replace 'T' with space for broader compatibility if needed, 
            # but fromisoformat usually handles it.
            return datetime.fromisoformat(date_str.replace('T', ' ') if 'T' in date_str else date_str)
        except:
            return None

    # Mapping fields from API (CamelCase) to DB (SnakeCase with prefix)
    db_data = {
        "G5_Name": data.get('Name'),
        "G5_Code": data.get('Code'),
        "G5_Description": data.get('Description'),
        "G5_DiscountType": data.get('DiscountType'),
        "G5_DiscountValue": float(data.get('DiscountValue')) if data.get('DiscountValue') else 0,
        "G5_MinOrderValue": float(data.get('MinOrderValue')) if data.get('MinOrderValue') else 0,
        "G5_MaxDiscount": float(data.get('MaxDiscount')) if data.get('MaxDiscount') else None,
        "G5_StartDate": parse_date(data.get('StartDate')),
        "G5_EndDate": parse_date(data.get('EndDate')),
        "G5_TotalQuantity": int(data.get('TotalQuantity')) if data.get('TotalQuantity') else 0,
        "G5_UserIdCreate": data.get('UserIdCreate'),
        "G5_ApplyToAll": int(data.get('ApplyToAll')) if data.get('ApplyToAll') is not None else 1,
        "G5_Status": data.get('Status', 'active')
    }
    stmt = insert(voucher).values(**db_data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_voucher(id, data):
    db_data = {}
    if 'Name' in data: db_data["G5_Name"] = data['Name']
    if 'Status' in data: db_data["G5_Status"] = data['Status']
    # Add more fields as needed
    
    if not db_data: return
    
    stmt = update(voucher).where(voucher.c.G5_Id == id).values(**db_data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_voucher(id):
    stmt = delete(voucher).where(voucher.c.G5_Id == id)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
