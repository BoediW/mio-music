#!/bin/bash
# ===================================
# MioMusic Bot - Oracle Cloud Setup
# ===================================

echo "🎵 MioMusic Bot Setup Script"
echo "============================"

# Update system
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install FFmpeg (required for music)
echo "📦 Installing FFmpeg..."
sudo apt install -y ffmpeg

# Install PM2 (process manager)
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Clone repository
echo "📥 Cloning MioMusic..."
git clone https://github.com/BoediW/mio-music.git
cd mio-music

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file
echo "📝 Creating .env file..."
cat > .env << 'EOF'
TOKEN=YOUR_DISCORD_BOT_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
GUILD_ID=YOUR_GUILD_ID
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file: nano .env"
echo "2. Add your Discord bot token and IDs"
echo "3. Start bot: pm2 start bot/index.js --name miomusic"
echo "4. Save PM2: pm2 save"
echo "5. Enable startup: pm2 startup"
echo ""
echo "🎵 MioMusic will now run 24/7!"
