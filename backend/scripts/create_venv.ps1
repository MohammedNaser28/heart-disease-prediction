Write-Host "🚀 Creating Python virtual environment..." -ForegroundColor Cyan
python -m venv venv

Write-Host "🔌 Activating the environment..." -ForegroundColor Cyan
.\venv\Scripts\activate

Write-Host "📦 Installing dependencies from requirements.txt..." -ForegroundColor Cyan
python -m pip install --upgrade pip
pip install -r requirements.txt

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host "To activate this environment later, just run: .\venv\Scripts\activate" -ForegroundColor Yellow