#!/bin/bash

echo "🚀 Setting up Job Hunt Insights Engine..."
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    echo "Visit: https://python.org/"
    exit 1
fi

echo "✅ Node.js and Python are installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install Python AI service dependencies
echo "📦 Installing Python AI service dependencies..."
cd ai_service
pip install -r requirements.txt
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 To start the application:"
echo ""
echo "Terminal 1 (Frontend):"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Backend):"
echo "  cd backend && npm start"
echo ""
echo "Terminal 3 (AI Service):"
echo "  cd ai_service && uvicorn main:app --reload --port 8000"
echo ""
echo "🌐 Access the application at: http://localhost:8080"
echo ""
echo "📚 For more information, see README.md" 