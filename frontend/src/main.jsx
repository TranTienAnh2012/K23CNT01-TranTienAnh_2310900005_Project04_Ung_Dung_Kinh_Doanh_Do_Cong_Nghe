import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import component chính của ứng dụng
import './index.css'; // Import các style toàn cục
import './translate.js'; // Khởi tạo Google Translate

// Tạo root của React và gắn vào phần tử có id='root' trong file index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

