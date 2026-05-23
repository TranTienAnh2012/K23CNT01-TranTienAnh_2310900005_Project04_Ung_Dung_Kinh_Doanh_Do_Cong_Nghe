@echo off
title Khoi dong Du an Cong Nghe G5
chcp 65001 > nul

echo ============================================================
echo      KHỞI ĐỘNG HỆ THỐNG KINH DOANH ĐỒ CÔNG NGHỆ G5
echo ============================================================
echo.

:: 1. Khởi động Backend API
echo [1/2] Đang khởi động Backend Flask API...
start "Backend API (Flask)" cmd /k "cd /d %~dp0api && (if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) else if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat)) && python run.py"

:: 2. Khởi động Frontend
echo [2/2] Đang khởi động Frontend React (Vite)...
start "Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ============================================================
echo   Hệ thống đang được chạy trong 2 cửa sổ Command Prompt mới.
echo   - Backend chạy tại: http://127.0.0.1:5000/api/health
echo   - Cửa sổ sẽ giữ nguyên (cmd /k) nếu có lỗi xảy ra để debug.
echo ============================================================
echo.
pause
