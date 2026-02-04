# 🚀 Panduan Deploy ke WispByte

Ikuti langkah-langkah ini untuk menjalankan bot **MioMusic** kamu di **WispByte**:

---

## 1. Persiapan Akun
1. Buka [wispbyte.com](https://wispbyte.com/).
2. Daftar akun baru atau login jika sudah punya.
3. Pastikan kamu sudah memiliki server (Free atau Premium) di dashboard mereka.

---

## 2. Membuat File ZIP
Pilih file-file berikut di laptop kamu:
1.  Pilih folder/file:
    *   📁 **`bot`** (beserta seluruh isinya)
    *   📄 **`package.json`**
    *   📄 **`package-lock.json`**
    *   📄 **`.env`** (opsional, bisa diinput manual di panel)
2.  **Klik kanan** pada file yang dipilih → **Send to** → **Compressed (zipped) folder**.
3.  Beri nama, misalnya `miomusic.zip`.

> **Catatan:** JANGAN masukkan folder `node_modules` atau folder `.git` agar ukuran file tidak terlalu besar.

---

## 3. Upload ke Panel WispByte
1.  Buka **Game Panel** WispByte kamu.
2.  Pilih server bot kamu.
3.  Klik menu **Files** di sidebar kiri.
4.  Klik tombol **Upload** dan pilih file `miomusic.zip` tadi.
5.  Setelah ter-upload, klik titik tiga pada file `miomusic.zip` lalu pilih **Unarchive**.

---

## 4. Konfigurasi Startup
1.  Klik menu **Startup** di sidebar.
2.  Pastikan **Main File** diatur ke: `bot/index.js`.
3.  Pastikan **Startup Command** menggunakan: `node bot/index.js` atau `npm start`.

---

## 5. Konfigurasi Client & Token
Ada dua cara:

### Cara A (File .env)
1.  Masuk ke menu **Files**.
2.  Jika belum ada, buat file baru bernama `.env`.
3.  Isi dengan:
    ```env
    TOKEN=token_bot_kamu
    CLIENT_ID=client_id_kamu
    GUILD_ID=id_server_kamu
    ```

### Cara B (Environment Variables)
1.  Masuk ke menu **Settings** atau **Environment**.
2.  Tambahkan variable `TOKEN`, `CLIENT_ID`, dan `GUILD_ID`.

---

## 6. Menjalankan Bot
1.  Masuk ke menu **Console**.
2.  Klik tombol **Start**.
3.  Jika kamu baru pertama kali upload, panel biasanya akan menginstall library secara otomatis (`npm install`).
4.  Jika muncul log `[INFO] MioMusic is ready as ...`, bot kamu sudah online!

---

### 🎵 Tips Cepat:
- Jika musik tidak berbunyi, pastikan server WispByte kamu sudah mendukung **FFmpeg**. Kamu bisa menanyakan hal ini ke support mereka melalui Discord atau Ticket.

Selamat bertugas! 🚀🎵
