from sqlalchemy import select, insert, update, delete, or_
from app.db.connection import engine
from app.models.schema import voucher, uservoucher
from datetime import datetime

def get_public_vouchers(user_id=None):
    now = datetime.utcnow()
    
    # Lấy các voucher đang hoạt động và còn thời hạn
    stmt = select(voucher).where(
        voucher.c.G5_Status == 'active',
        or_(voucher.c.G5_StartDate == None, voucher.c.G5_StartDate <= now),
        or_(voucher.c.G5_EndDate == None, voucher.c.G5_EndDate >= now)
    )
    
    claimed_ids = set()
    if user_id:
        stmt_claimed = select(uservoucher.c.G5_VoucherId).where(
            uservoucher.c.G5_UserId == user_id
        )
        with engine.connect() as conn:
            claimed_rows = conn.execute(stmt_claimed).fetchall()
            claimed_ids = {row._mapping['G5_VoucherId'] for row in claimed_rows}
            
    with engine.connect() as conn:
        result = conn.execute(stmt).fetchall()
        items = []
        for row in result:
            row_dict = row._mapping
            v_id = row_dict['G5_Id']
            
            total_qty = row_dict['G5_TotalQuantity']
            used_qty = row_dict['G5_UsedQuantity'] or 0
            
            items.append({
                "Id": v_id,
                "Name": row_dict['G5_Name'],
                "Code": row_dict['G5_Code'],
                "Description": row_dict['G5_Description'],
                "DiscountType": row_dict['G5_DiscountType'],
                "DiscountValue": float(row_dict['G5_DiscountValue']) if row_dict['G5_DiscountValue'] else 0,
                "MinOrderValue": float(row_dict['G5_MinOrderValue']) if row_dict['G5_MinOrderValue'] else 0,
                "MaxDiscount": float(row_dict['G5_MaxDiscount']) if row_dict['G5_MaxDiscount'] else 0,
                "StartDate": row_dict['G5_StartDate'].isoformat() if row_dict['G5_StartDate'] else None,
                "EndDate": row_dict['G5_EndDate'].isoformat() if row_dict['G5_EndDate'] else None,
                "TotalQuantity": total_qty,
                "UsedQuantity": used_qty,
                "Claimed": v_id in claimed_ids
            })
        return items

def claim_voucher(user_id, voucher_id):
    stmt_voucher = select(voucher).where(voucher.c.G5_Id == voucher_id, voucher.c.G5_Status == 'active')
    
    with engine.begin() as conn:
        row = conn.execute(stmt_voucher).fetchone()
        if not row:
            raise Exception("Voucher không tồn tại hoặc đã ngừng hoạt động.")
            
        row_dict = row._mapping
        
        now = datetime.utcnow()
        if row_dict['G5_StartDate'] and row_dict['G5_StartDate'] > now:
            raise Exception("Chương trình ưu đãi chưa bắt đầu.")
        if row_dict['G5_EndDate'] and row_dict['G5_EndDate'] < now:
            raise Exception("Voucher đã hết hạn sử dụng.")
            
        total_qty = row_dict['G5_TotalQuantity']
        used_qty = row_dict['G5_UsedQuantity'] or 0
        if total_qty is not None and used_qty >= total_qty:
            raise Exception("Rất tiếc, mã giảm giá này đã hết lượt nhận.")
            
        stmt_check = select(uservoucher).where(
            uservoucher.c.G5_UserId == user_id,
            uservoucher.c.G5_VoucherId == voucher_id
        )
        claimed_row = conn.execute(stmt_check).fetchone()
        if claimed_row:
            raise Exception("Bạn đã nhận mã giảm giá này rồi.")
            
        stmt_claim = insert(uservoucher).values(
            G5_UserId=user_id,
            G5_VoucherId=voucher_id,
            G5_ClaimedAt=now,
            G5_ExpiredAt=row_dict['G5_EndDate'],
            G5_IsUsed=0
        )
        conn.execute(stmt_claim)
        return True

def get_my_vouchers(user_id):
    stmt = select(
        uservoucher.c.G5_Id.label('UserVoucherId'),
        uservoucher.c.G5_ClaimedAt,
        uservoucher.c.G5_IsUsed,
        uservoucher.c.G5_UsedAt,
        voucher.c.G5_Id.label('VoucherId'),
        voucher.c.G5_Name,
        voucher.c.G5_Code,
        voucher.c.G5_Description,
        voucher.c.G5_DiscountType,
        voucher.c.G5_DiscountValue,
        voucher.c.G5_MinOrderValue,
        voucher.c.G5_MaxDiscount,
        voucher.c.G5_EndDate
    ).select_from(
        uservoucher.join(voucher, uservoucher.c.G5_VoucherId == voucher.c.G5_Id)
    ).where(
        uservoucher.c.G5_UserId == user_id
    ).order_by(
        uservoucher.c.G5_ClaimedAt.desc()
    )
    
    with engine.connect() as conn:
        rows = conn.execute(stmt).fetchall()
        items = []
        for r in rows:
            r_dict = r._mapping
            items.append({
                "UserVoucherId": r_dict['UserVoucherId'],
                "ClaimedAt": r_dict['G5_ClaimedAt'].isoformat() if r_dict['G5_ClaimedAt'] else None,
                "IsUsed": r_dict['G5_IsUsed'] == 1,
                "UsedAt": r_dict['G5_UsedAt'].isoformat() if r_dict['G5_UsedAt'] else None,
                "VoucherId": r_dict['VoucherId'],
                "Name": r_dict['G5_Name'],
                "Code": r_dict['G5_Code'],
                "Description": r_dict['G5_Description'],
                "DiscountType": r_dict['G5_DiscountType'],
                "DiscountValue": float(r_dict['G5_DiscountValue']) if r_dict['G5_DiscountValue'] else 0,
                "MinOrderValue": float(r_dict['G5_MinOrderValue']) if r_dict['G5_MinOrderValue'] else 0,
                "MaxDiscount": float(r_dict['G5_MaxDiscount']) if r_dict['G5_MaxDiscount'] else 0,
                "EndDate": r_dict['G5_EndDate'].isoformat() if r_dict['G5_EndDate'] else None,
            })
        return items
