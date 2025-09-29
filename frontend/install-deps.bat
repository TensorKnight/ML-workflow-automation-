@echo off
echo Installing ML Workflow Frontend Dependencies...
echo.

echo Cleaning npm cache...
npm cache clean --force

echo.
echo Installing dependencies with legacy peer deps...
npm install --legacy-peer-deps

echo.
echo Installation complete!
echo.
echo To start the development server, run:
echo npm run dev
echo.
pause

