# 🎵 MioMusic - Bot Musik Discord

<div align="center">

![MioMusic Banner](https://media.tenor.com/7I6Dlyi_f_8AAAAd/mio-akiyama-k-on.gif)

**Bot musik Discord premium dengan dukungan SoundCloud & Spotify**

[![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue.svg)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## ✨ Fitur

- 🎹 **Dukungan SoundCloud & Spotify** - Stream musik dari platform populer
- 🎛️ **Kontrol Interaktif** - Play, pause, skip, previous dengan tombol
- 🔁 **Mode Loop** - Loop satu lagu atau seluruh antrean
- 🔀 **Shuffle** - Acak antrean musik
- 📋 **Manajemen Antrean** - Lihat dan kelola antrean musik
- 🔊 **Kontrol Volume** - Atur volume dengan tombol
- 🎨 **Embed Cantik** - Pesan now playing yang informatif
- ⚡ **Cepat & Handal** - Dibangun dengan discord-player

---

## 📦 Instalasi

### Persyaratan

- [Node.js](https://nodejs.org/) versi 18 atau lebih tinggi
- [FFmpeg](https://ffmpeg.org/) terinstall di sistem
- Token Bot Discord

### Langkah 1: Clone Repository

```bash
git clone https://github.com/username-kamu/mio-music.git
cd mio-music
```

### Langkah 2: Install Dependencies

```bash
npm install
```

### Langkah 3: Konfigurasi Environment Variables

Buat file `.env` di direktori root:

```env
TOKEN=token_bot_discord_kamu
CLIENT_ID=client_id_bot_kamu
GUILD_ID=guild_id_untuk_testing
```

### Langkah 4: Jalankan Bot

```bash
# Jalankan bot Discord saja
npm run start:bot

# Jalankan bot dan website
npm start
```

---

## 🎮 Daftar Command

| Command | Deskripsi |
|---------|-----------|
| `/play <query>` | Putar lagu dari SoundCloud atau Spotify |
| `/playlist <query>` | Putar playlist dari SoundCloud atau Spotify |
| `/loop <mode>` | Atur mode loop (track/queue/off) |
| `/nowplaying` | Tampilkan lagu yang sedang diputar |
| `/queue` | Tampilkan antrean musik |
| `/skip` | Lewati ke lagu berikutnya |
| `/pause` | Jeda lagu |
| `/resume` | Lanjutkan pemutaran |
| `/stop` | Hentikan pemutaran dan hapus antrean |
| `/volume <1-100>` | Atur volume |
| `/shuffle` | Acak antrean |
| `/ping` | Cek latensi bot |
| `/help` | Tampilkan semua command |

---

## 🎛️ Kontrol Tombol

Saat lagu diputar, kamu akan melihat tombol interaktif:

| Tombol | Fungsi |
|--------|--------|
| ⏮️ | Lagu sebelumnya |
| ⏯️ | Play/Pause |
| ⏭️ | Lewati lagu |
| 🔁 | Ganti mode loop |
| ⏹️ | Stop & disconnect |
| 🔉 | Volume turun |
| 🔊 | Volume naik |
| 📋 | Lihat antrean |
| 🔀 | Acak antrean |

---

## 🔧 Konfigurasi

### Konfigurasi Bot

Edit `bot/index.js` untuk kustomisasi:

```javascript
client.config = {
    name: "MioMusic",
    color: "#ff69b4", // Warna tema (Pink)
    premium: true,
    invite: "https://discord.com/api/oauth2/authorize?client_id=ID_KAMU&permissions=8&scope=bot%20applications.commands"
};
```

---

## 📁 Struktur Proyek

```
mio-music/
├── bot/
│   ├── commands/          # Slash commands
│   │   ├── play.js
│   │   ├── playlist.js
│   │   ├── loop.js
│   │   ├── queue.js
│   │   └── ...
│   ├── events/            # Event Discord
│   │   ├── ready.js
│   │   ├── interactionCreate.js
│   │   └── player/        # Event player
│   ├── utils/             # Utilitas
│   └── index.js           # Entry point bot
├── src/                   # Website Astro (opsional)
├── .env                   # Environment variables
├── package.json
└── README.md
```

---

## 🎵 Platform yang Didukung

| Platform | Status | Catatan |
|----------|--------|---------|
| SoundCloud | ✅ Didukung | Track & Playlist |
| Spotify | ✅ Didukung | Track, Playlist & Album |
| YouTube | ❌ Tidak Didukung | Karena pembatasan |

---

## 🚀 Deployment

### Deploy ke Railway

1. Fork repository ini
2. Buat proyek baru di [Railway](https://railway.app/)
3. Hubungkan repository GitHub kamu
4. Tambahkan environment variables
5. Deploy!

### Deploy ke Render

1. Fork repository ini
2. Buat Web Service baru di [Render](https://render.com/)
3. Hubungkan repository GitHub kamu
4. Atur environment variables
5. Deploy!

---

## 🐛 Troubleshooting

### Bot tidak merespon command
- Pastikan bot memiliki izin yang tepat
- Cek apakah bot online
- Verifikasi TOKEN di `.env`

### Tidak ada suara
- Pastikan FFmpeg terinstall
- Cek apakah bot punya izin voice
- Coba lagu/link yang berbeda

### "Could not extract stream"
- Sumber mungkin dibatasi secara geografis
- Coba gunakan link SoundCloud atau Spotify langsung

---

## 📝 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan kirimkan Pull Request.

1. Fork proyek
2. Buat branch fitur (`git checkout -b fitur/FiturKeren`)
3. Commit perubahan (`git commit -m 'Tambah FiturKeren'`)
4. Push ke branch (`git push origin fitur/FiturKeren`)
5. Buka Pull Request

---

## 💖 Kredit

- Dibangun dengan [Discord.js](https://discord.js.org/)
- Mesin musik oleh [discord-player](https://discord-player.js.org/)
- Terinspirasi dari Mio Akiyama dari K-ON!

---

<div align="center">

**Dibuat dengan ❤️ oleh Tim MioMusic**

[Laporkan Bug](https://github.com/username-kamu/mio-music/issues) · [Minta Fitur](https://github.com/username-kamu/mio-music/issues)

</div>
