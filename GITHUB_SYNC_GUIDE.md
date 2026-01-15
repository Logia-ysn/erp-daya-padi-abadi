# GitHub Synchronization Guide

## 📋 Panduan Sinkronisasi dengan GitHub

Dokumen ini berisi langkah-langkah untuk menyinkronkan project ERP Daya Padi Abadi dengan GitHub repository.

---

## 🔧 Setup Awal (One-time Setup)

### 1. Konfigurasi Git User

Jalankan command berikut untuk mengatur identitas Git Anda:

```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@anda.com"
```

**Contoh:**
```bash
git config --global user.name "John Doe"
git config --global user.email "john.doe@example.com"
```

### 2. Buat GitHub Repository

1. Buka [GitHub.com](https://github.com)
2. Login ke akun Anda
3. Klik tombol **"New"** atau **"+"** → **"New repository"**
4. Isi informasi repository:
   - **Repository name**: `erp-daya-padi-abadi` (atau nama lain)
   - **Description**: "ERP Manufacturing System for Daya Padi Abadi"
   - **Visibility**: Private (recommended) atau Public
   - **JANGAN** centang "Initialize with README" (karena kita sudah punya)
5. Klik **"Create repository"**

### 3. Hubungkan Local Repository dengan GitHub

Setelah repository dibuat, GitHub akan menampilkan URL. Gunakan URL tersebut:

```bash
# Ganti URL_REPOSITORY dengan URL dari GitHub Anda
git remote add origin https://github.com/username/erp-daya-padi-abadi.git

# Atau jika menggunakan SSH:
git remote add origin git@github.com:username/erp-daya-padi-abadi.git
```

**Contoh:**
```bash
git remote add origin https://github.com/johndoe/erp-daya-padi-abadi.git
```

### 4. Verifikasi Remote

```bash
git remote -v
```

Output yang diharapkan:
```
origin  https://github.com/username/erp-daya-padi-abadi.git (fetch)
origin  https://github.com/username/erp-daya-padi-abadi.git (push)
```

---

## 📤 Push Pertama Kali

Setelah setup selesai, push code ke GitHub:

```bash
# Push ke branch main
git push -u origin main
```

Jika diminta username dan password:
- **Username**: Username GitHub Anda
- **Password**: Gunakan **Personal Access Token** (bukan password akun)

### Cara Membuat Personal Access Token:

1. Buka GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Klik **"Generate new token"** → **"Generate new token (classic)"**
3. Beri nama token, contoh: "ERP Daya Padi Token"
4. Pilih scope: **`repo`** (full control of private repositories)
5. Klik **"Generate token"**
6. **COPY token** dan simpan di tempat aman (token hanya ditampilkan sekali!)

---

## 🔄 Workflow Harian (Daily Sync)

### Setiap Kali Ada Perubahan:

```bash
# 1. Cek status perubahan
git status

# 2. Tambahkan semua perubahan
git add .

# 3. Commit dengan pesan yang jelas
git commit -m "feat: deskripsi perubahan yang dilakukan"

# 4. Push ke GitHub
git push
```

### Contoh Commit Messages:

```bash
# Fitur baru
git commit -m "feat: add stock management integration"

# Perbaikan bug
git commit -m "fix: resolve navigation issue in sidebar"

# Update UI
git commit -m "ui: update dashboard theme to emerald green"

# Dokumentasi
git commit -m "docs: update README with installation guide"

# Refactor
git commit -m "refactor: improve code structure in DoubleSidebar"
```

---

## 🔄 Pull Changes (Jika Ada Perubahan dari GitHub)

Jika Anda bekerja dari komputer lain atau ada perubahan di GitHub:

```bash
# Pull perubahan terbaru
git pull origin main
```

---

## 📋 Command Cheat Sheet

| Command | Deskripsi |
|---------|-----------|
| `git status` | Cek status perubahan |
| `git add .` | Tambahkan semua perubahan |
| `git add <file>` | Tambahkan file tertentu |
| `git commit -m "message"` | Commit dengan pesan |
| `git push` | Push ke GitHub |
| `git pull` | Pull dari GitHub |
| `git log --oneline` | Lihat history commit |
| `git remote -v` | Lihat remote repository |
| `git branch` | Lihat branch yang ada |

---

## 🔐 Tips Keamanan

1. **JANGAN** commit file `.env` yang berisi credentials
2. File `.env` sudah ada di `.gitignore` (aman)
3. Gunakan `.env.example` untuk template
4. Simpan Personal Access Token di tempat aman
5. Untuk project private, gunakan repository **Private**

---

## 🚀 Automation (Optional)

### Setup Git Alias untuk Workflow Cepat:

```bash
# Tambahkan alias
git config --global alias.sync '!git add . && git commit -m "sync: update changes" && git push'

# Cara pakai:
git sync
```

---

## ❓ Troubleshooting

### Error: "failed to push some refs"

**Solusi:**
```bash
git pull origin main --rebase
git push
```

### Error: "Authentication failed"

**Solusi:**
- Pastikan menggunakan Personal Access Token, bukan password
- Generate token baru jika sudah expired

### Error: "remote origin already exists"

**Solusi:**
```bash
git remote remove origin
git remote add origin <URL_BARU>
```

---

## 📞 Support

Jika ada masalah, hubungi:
- GitHub Docs: https://docs.github.com
- Git Docs: https://git-scm.com/doc

---

**Last Updated:** 2026-01-14
**Version:** 1.0.0
