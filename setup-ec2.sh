#!/bin/bash

echo "🚀 Setting up EC2 instance for Docker deployment..."

# Add current user to docker group
echo "📝 Adding $USER to docker group..."
sudo usermod -aG docker $USER

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed successfully"
else
    echo "✅ Docker Compose is already installed"
fi

# Verify installations
echo "🔍 Verifying Docker installation..."
sudo docker --version

echo "🔍 Verifying Docker Compose installation..."
sudo docker-compose --version

# Check if Docker service is running
echo "🔍 Checking Docker service status..."
sudo systemctl status docker --no-pager

echo ""
echo "✅ Setup complete!"
echo "⚠️  NOTE: You may need to log out and log back in for group changes to take effect"
echo "🔄 Or run: newgrp docker"
echo ""
echo "🧪 Test your setup by running:"
echo "   sudo docker-compose -f docker-compose.simple.yml up -d --build" 