# 🚀 Panduan Deploy ke DisCloud

Ikuti langkah-langkah ini untuk menjalankan bot **MioMusic** kamu 24/7 secara gratis:

---

## 1. Persiapan Akun
1. Buka [discloudbot.com](https://discloudbot.com/).
2. Login menggunakan akun **Discord** kamu.

---

## 2. Persiapan File
1. Pastikan file `discloud.config` sudah ada di root folder (sudah saya buatkan).
2. Update file `discloud.config` di bagian `ID=`:
   - Isi dengan **Client ID** bot kamu (angka panjang dari Discord Developer Portal).

---

## 3. Cara Deploy (Pilih salah satu)

### Opsi A: Pakai Website (Mudah)
1. Pilih semua file proyek kamu (kecuali folder `node_modules` dan `.git`).
2. Klik kanan → **Compress to ZIP file**.
3. Buka Dashboard DisCloud → Klik **Add App** → Upload file ZIP tadi.
4. Tunggu proses instalasi selesai.

### Opsi B: Pakai Bot DisCloud (Paling Cepat)
1. Gabung ke [server Discord DisCloud](https://discord.gg/discloud).
2. Di salah satu channel bot mereka, ketik `.up` dan upload file ZIP kamu.

---

## 4. Konfigurasi Bot (.env)
Setelah bot ter-upload:
1. Pergi ke Dashboard DisCloud.
2. Klik nama bot kamu → Klik tab **Settings** atau **Variables**.
3. Masukkan variable dari file `.env` kamu:
   - `TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID`

---

## 5. Menjalankan Bot
1. Klik **Start** di dashboard.
2. Cek tab **Console** untuk melihat apakah bot berhasil jalan.
3. Ketik `/ping` di server Discord kamu untuk tes!

---

### Tips Penting:
- **FFmpeg**: Tenang saja, saya sudah menambahkan `APT=ffmpeg` di config agar suara musik bisa jalan.
- **RAM**: Paket free DisCloud memberikan 512MB RAM, bot ini sangat efisien jadi 100MB sudah lebih dari cukup.
- **24/7**: Bot akan terus online selama kamu tidak menghentikannya secara manual.

Selamat mencoba! 🎵🚀
