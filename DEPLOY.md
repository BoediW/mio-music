# 🚀 Deploy MioMusic ke Bot-Hosting.net

## Langkah 1: Daftar
1. Buka https://bot-hosting.net
2. Klik "Get Started"
3. Login dengan Discord
4. Join Discord server mereka

## Langkah 2: Request Free Server
1. Di dashboard, klik "Request Free Server"
2. Isi form:
   - Bot Name: MioMusic
   - Description: Discord Music Bot with SoundCloud & Spotify
   - Language: Node.js
3. Tunggu approval (1-24 jam)

## Langkah 3: Upload Bot
Setelah approved:
1. Buka File Manager
2. Upload semua file:
   - Folder `bot/` (semua isinya)
   - `package.json`
   - `package-lock.json`
3. Buat file `.env` di panel dengan isi:
```
TOKEN=your_discord_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
```

## Langkah 4: Start Bot
1. Set Startup Command: `npm run start:bot`
2. Klik "Start"
3. Cek Console untuk log
4. Bot online! 🎵

## Troubleshooting
- Jika error "module not found": Jalankan `npm install` di console
- Jika bot tidak respond: Cek token di .env
- Jika musik tidak jalan: Pastikan ffmpeg sudah terinstall

## Selesai!
Bot MioMusic sekarang online 24/7 di Bot-Hosting.net! 🎵
