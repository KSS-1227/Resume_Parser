@echo off
echo 🚀 Deploying Job Hunt Insights Engine to FREE platforms
echo ==================================================

echo 1. Building frontend for Vercel...
call npm run build

echo 2. Preparing backend for Render...
cd backend
call npm install
cd ..

echo 3. Preparing AI service for Railway...
cd ai_service
call pip install -r requirements.txt
cd ..

echo ✅ Ready for deployment!
echo.
echo 📋 Next Steps:
echo 1. Push code to GitHub
echo 2. Deploy backend to Render.com ^(FREE^)
echo 3. Deploy AI service to Railway.app ^(FREE^)
echo 4. Deploy frontend to Vercel.com ^(FREE^)
echo 5. Set environment variables
echo.
echo 🎉 All platforms are 100%% FREE!
pause 