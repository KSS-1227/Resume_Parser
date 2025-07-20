@echo off
echo 🚀 Setting up Job Hunt Insights Engine...
echo ==========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    echo Visit: https://python.org/
    pause
    exit /b 1
)

echo ✅ Node.js and Python are installed

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install Python AI service dependencies
echo 📦 Installing Python AI service dependencies...
cd ai_service
call pip install -r requirements.txt
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🎯 To start the application:
echo.
echo Terminal 1 (Frontend):
echo   npm run dev
echo.
echo Terminal 2 (Backend):
echo   cd backend ^&^& npm start
echo.
echo Terminal 3 (AI Service):
echo   cd ai_service ^&^& uvicorn main:app --reload --port 8000
echo.
echo 🌐 Access the application at: http://localhost:8080
echo.
echo 📚 For more information, see README.md
pause 