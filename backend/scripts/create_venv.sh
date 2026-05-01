#!/bin/bash

echo "🚀 Creating Python virtual environment..."
# Using python3 -m venv to create a folder named 'venv'
python3 -m venv venv

echo "🔌 Activating the environment..."
source venv/bin/activate

echo "📦 Installing dependencies from requirements.txt..."
# Upgrade pip first, then install requirements
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Setup complete!"
echo "To activate this environment later, just run: source venv/bin/activate"