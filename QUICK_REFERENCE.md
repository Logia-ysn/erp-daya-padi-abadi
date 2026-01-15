# 🚀 Quick Reference - GitHub Sync

## ⚡ Cara Tercepat

### Menggunakan Script Otomatis:
```bash
./sync-github.sh
```

Script ini akan:
1. ✅ Konfigurasi Git user (jika belum)
2. ✅ Add semua perubahan
3. ✅ Commit dengan pesan
4. ✅ Push ke GitHub

---

## 📋 Manual Commands

### First Time Setup:
```bash
# 1. Set Git user
git config --global user.name "Nama Anda"
git config --global user.email "email@anda.com"

# 2. Add remote (ganti dengan URL repository Anda)
git remote add origin https://github.com/username/erp-daya-padi-abadi.git

# 3. Push pertama kali
git push -u origin main
```

### Daily Workflow:
```bash
# Cek perubahan
git status

# Add & commit & push
git add .
git commit -m "feat: deskripsi perubahan"
git push
```

---

## 🔑 Personal Access Token

Jika diminta password saat push:

1. Buka: https://github.com/settings/tokens
2. Generate new token (classic)
3. Pilih scope: **repo**
4. Copy token
5. Gunakan token sebagai password

---

## 📝 Commit Message Format

```bash
feat: fitur baru
fix: perbaikan bug
ui: perubahan tampilan
docs: update dokumentasi
refactor: refactor code
```

---

## ❓ Troubleshooting

### Error: Authentication failed
**Solusi:** Gunakan Personal Access Token, bukan password

### Error: remote origin already exists
```bash
git remote remove origin
git remote add origin <URL_BARU>
```

### Error: failed to push
```bash
git pull origin main --rebase
git push
```

---

## 📞 Need Help?

Baca dokumentasi lengkap di:
- [GITHUB_SYNC_GUIDE.md](GITHUB_SYNC_GUIDE.md)
- [README.md](README.md)
