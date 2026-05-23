from dotenv import load_dotenv
import os

# Load .env trước khi import app để đảm bảo biến môi trường được đọc đúng
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

from app import create_app

# Chỉ tạo app MỘT lần duy nhất ở đây
app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
