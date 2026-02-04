# 🚀 Deploy MioMusic ke Oracle Cloud

## Persyaratan
- Akun Oracle Cloud (gratis)
- SSH client (PuTTY untuk Windows / Terminal untuk Mac/Linux)

---

## Step 1: Daftar Oracle Cloud

1. Buka https://www.oracle.com/cloud/free/
2. Klik "Start for free"
3. Isi data dan verifikasi email
4. Masukkan kartu kredit (TIDAK dicharge, hanya verifikasi)
5. Pilih region: **Singapore** (dekat Indonesia)

---

## Step 2: Buat VM Instance

1. Login ke Oracle Cloud Console
2. Klik hamburger menu (☰) → Compute → Instances
3. Klik "Create Instance"
4. Konfigurasi:
   - **Name:** `miomusic-bot`
   - **Placement:** Default
   - **Image:** Ubuntu 22.04 (klik "Edit" → "Change Image")
   - **Shape:** VM.Standard.E2.1.Micro (FREE!)
5. Di bagian "Add SSH keys":
   - Pilih "Generate a key pair for me"
   - Download KEDUA file (.key dan .pub)
   - **SIMPAN BAIK-BAIK!**
6. Klik "Create"
7. Tunggu status RUNNING

---

## Step 3: Connect ke Server

### Windows (PuTTY):
1. Download PuTTY: https://putty.org/
2. Buka PuTTYgen, Load file .key, Save as .ppk
3. Buka PuTTY:
   - Host: IP_ADDRESS_VM (lihat di Oracle Console)
   - Port: 22
   - Connection → SSH → Auth → Browse: pilih file .ppk
4. Klik Open
5. Login as: `ubuntu`

### Mac/Linux:
```bash
chmod 400 ssh-key.key
ssh -i ssh-key.key ubuntu@IP_ADDRESS_VM
```

---

## Step 4: Setup Bot

Setelah connect ke server, jalankan:

```bash
# Download dan jalankan setup script
curl -fsSL https://raw.githubusercontent.com/BoediW/mio-music/main/setup-oracle.sh | bash
```

Atau manual:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install FFmpeg
sudo apt install -y ffmpeg

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/BoediW/mio-music.git
cd mio-music

# Install dependencies
npm install
```

---

## Step 5: Konfigurasi .env

```bash
cd mio-music
nano .env
```

Isi dengan:
```
TOKEN=your_discord_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
```

Simpan: `Ctrl+X`, `Y`, `Enter`

---

## Step 6: Jalankan Bot 24/7

```bash
# Start bot dengan PM2
pm2 start bot/index.js --name miomusic

# Save PM2 config
pm2 save

# Enable auto-start saat server reboot
pm2 startup
# (ikuti instruksi yang muncul)
```

---

## Commands PM2 Berguna

```bash
pm2 list              # Lihat status bot
pm2 logs miomusic     # Lihat log bot
pm2 restart miomusic  # Restart bot
pm2 stop miomusic     # Stop bot
pm2 delete miomusic   # Hapus bot dari PM2
```

---

## ⚠️ Firewall Oracle Cloud

Jika bot tidak bisa connect, buka port di Oracle:

1. Oracle Console → Networking → Virtual Cloud Networks
2. Klik VCN → Security Lists → Default Security List
3. Add Ingress Rules:
   - Source: 0.0.0.0/0
   - Protocol: All Protocols
4. Save

---

## ✅ Selesai!

Bot MioMusic sekarang berjalan 24/7 di Oracle Cloud! 🎵
