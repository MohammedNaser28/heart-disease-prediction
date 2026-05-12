#!/bin/bash
# =============================================================
# CardioPredict — EC2 One-Time Setup Script
# Run this on a fresh Ubuntu 22.04 EC2 instance
# =============================================================
set -e

echo "🚀 Starting CardioPredict deployment setup..."

# ── 1. Update system packages ─────────────────────────────────
echo "📦 Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# ── 2. Install Docker ─────────────────────────────────────────
echo "🐳 Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Allow running docker without sudo
sudo usermod -aG docker ubuntu
newgrp docker

echo "✅ Docker installed: $(docker --version)"
echo "✅ Docker Compose installed: $(docker compose version)"

# ── 3. Clone the repository ────────────────────────────────────
echo "📥 Cloning repository..."
# IMPORTANT: Replace the URL below with your actual GitHub repo URL
REPO_URL="https://github.com/Abdallah-Osama-cpp/heart-disease-prediction.git"
BRANCH="advanced-predict"

git clone --branch "$BRANCH" "$REPO_URL" app
cd app

# ── 4. Build and start the application ────────────────────────
echo "🔨 Building Docker images (this may take 3–5 minutes)..."
docker compose -f docker-compose.prod.yml build --no-cache

echo "🟢 Starting the application..."
docker compose -f docker-compose.prod.yml up -d

echo ""
echo "============================================="
echo "✅  CardioPredict is now LIVE!"
echo "============================================="
echo "🌐 Open in your browser:"
echo "   http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "============================================="
