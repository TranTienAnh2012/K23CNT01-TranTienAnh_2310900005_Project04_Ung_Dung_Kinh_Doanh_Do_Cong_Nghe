from sqlalchemy import text
from app.db.connection import engine

def find_user_by_credentials(email, password):
    query = "SELECT * FROM G5_user WHERE G5_Email = :email AND G5_MatKhau = :pass AND G5_IsDeleted = 0"
    with engine.connect() as conn:
        return conn.execute(text(query), {"email": email, "pass": password}).fetchone()
