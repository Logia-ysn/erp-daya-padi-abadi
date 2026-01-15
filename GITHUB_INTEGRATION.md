# 🚀 GitHub Integration Guide - ERP Daya Padi Abadi

Panduan lengkap untuk mengintegrasikan project ERP Daya Padi Abadi ke GitHub.

---

## 📋 PREREQUISITES

Sebelum memulai, pastikan Anda sudah:
- ✅ Memiliki akun GitHub (https://github.com)
- ✅ Git sudah terinstall di komputer
- ✅ Git sudah dikonfigurasi dengan nama dan email Anda

### Cek Git Configuration

```bash
# Cek konfigurasi git
git config --global user.name
git config --global user.email

# Jika belum dikonfigurasi, set dengan:
git config --global user.name "Nama Anda"
git config --global user.email "email@anda.com"
```

---

## 🔐 SETUP GITHUB AUTHENTICATION

### Option 1: HTTPS (Recommended for beginners)

Gunakan Personal Access Token (PAT):

1. Buka GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Pilih scopes: `repo` (full control of private repositories)
4. Copy token yang dihasilkan
5. Saat push, gunakan token sebagai password

### Option 2: SSH (Recommended for advanced users)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "email@anda.com"

# Start ssh-agent
eval "$(ssh-agent -s)"

# Add SSH key
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Paste ke GitHub → Settings → SSH and GPG keys → New SSH key
```

---

## 📦 STEP-BY-STEP INTEGRATION

### Step 1: Create Repository di GitHub

1. Login ke GitHub
2. Klik tombol **"+"** di pojok kanan atas → **New repository**
3. Isi detail repository:
   - **Repository name**: `erp-daya-padi-abadi` atau `saas-daya-padi-abadi`
   - **Description**: "ERP System for PT Pangan Masa Depan - Rice Mill Management"
   - **Visibility**: 
     - **Private** (jika tidak ingin publik)
     - **Public** (jika ingin open source)
   - ❌ **JANGAN** centang "Initialize this repository with a README"
   - ❌ **JANGAN** tambah .gitignore atau license (sudah ada di project)
4. Klik **Create repository**

### Step 2: Connect Local Repository ke GitHub

Setelah repository dibuat, GitHub akan menampilkan instruksi. Gunakan yang ini:

```bash
# Pastikan Anda di directory project
cd "/home/logia/Software Engineer/SaaS Daya Padi Abadi"

# Add all files to staging
git add .

# Create first commit
git commit -m "Initial commit: ERP Daya Padi Abadi v1.0

- Complete ERP system with Production, Sales, Procurement, Finance, and HRD modules
- Worksheet feature with full CRUD and integration
- Performance tracking and analytics
- Downtime monitoring
- Real-time data synchronization
- Responsive UI with modern design"

# Add remote repository (ganti dengan URL repository Anda)
git remote add origin https://github.com/USERNAME/REPO-NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Ganti `USERNAME/REPO-NAME` dengan repository Anda!**

Contoh:
```bash
git remote add origin https://github.com/logia/erp-daya-padi-abadi.git
```

---

## 🔄 WORKFLOW SETELAH SETUP

### Setiap Kali Ada Perubahan:

```bash
# 1. Check status
git status

# 2. Add files yang berubah
git add .
# atau add file spesifik:
git add src/pages/production/WorksheetPage.jsx

# 3. Commit dengan message yang jelas
git commit -m "feat: add filter panel to worksheet page"

# 4. Push ke GitHub
git push
```

### Commit Message Best Practices:

```bash
# Feature baru
git commit -m "feat: add worksheet integration to performance page"

# Bug fix
git commit -m "fix: resolve machine dropdown issue in downtime page"

# Update/improvement
git commit -m "refactor: optimize worksheet data calculations"

# Documentation
git commit -m "docs: update README with deployment instructions"

# Style/UI changes
git commit -m "style: improve responsive design for mobile"
```

---

## 📁 FILES TO IGNORE

File `.gitignore` sudah dikonfigurasi dengan benar. Files yang **TIDAK** akan di-push ke GitHub:

```
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
```

**PENTING**: File `.env` tidak akan ter-upload ke GitHub (aman untuk credentials)

---

## 🌿 BRANCHING STRATEGY (Optional)

Untuk development yang lebih terorganisir:

```bash
# Create development branch
git checkout -b development

# Create feature branch
git checkout -b feature/new-feature-name

# Setelah selesai, merge ke main
git checkout main
git merge feature/new-feature-name

# Push branch ke GitHub
git push origin feature/new-feature-name
```

### Recommended Branch Structure:

```
main (production-ready code)
├── development (active development)
│   ├── feature/worksheet-filters
│   ├── feature/supabase-integration
│   └── bugfix/performance-calculation
```

---

## 🔒 SECURITY CHECKLIST

Sebelum push ke GitHub, pastikan:

- [ ] ✅ File `.env` ada di `.gitignore`
- [ ] ✅ Tidak ada API keys hardcoded di code
- [ ] ✅ Tidak ada passwords di code
- [ ] ✅ Supabase credentials di `.env`, bukan di code
- [ ] ✅ `.env.example` sudah dibuat (tanpa values real)

---

## 📝 UPDATE README.md

Sebelum push, update `README.md` dengan informasi:

```markdown
# ERP Daya Padi Abadi

ERP System untuk PT Pangan Masa Depan - Rice Mill Management

## Features
- Production Management (Worksheet, Performance, Downtime)
- Sales & Customer Management
- Procurement & Supplier Management
- Inventory Management
- Finance & Expense Tracking
- HRD & Employee Management

## Tech Stack
- React + Vite
- TailwindCSS
- Recharts
- Supabase (optional)
- localStorage (default storage)

## Installation
\`\`\`bash
npm install
npm run dev
\`\`\`

## Environment Variables
Copy `.env.example` to `.env` and fill in your credentials.
```

---

## 🎯 QUICK START COMMANDS

```bash
# 1. Add all changes
git add .

# 2. Commit
git commit -m "Initial commit: ERP Daya Padi Abadi"

# 3. Add remote (ganti dengan URL Anda)
git remote add origin https://github.com/USERNAME/REPO-NAME.git

# 4. Push
git push -u origin main
```

---

## 🆘 TROUBLESHOOTING

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/REPO-NAME.git
```

### Error: "failed to push some refs"
```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### Error: "Authentication failed"
- Pastikan menggunakan Personal Access Token, bukan password
- Atau setup SSH key

### Undo last commit (belum push)
```bash
git reset --soft HEAD~1
```

### Undo changes di file
```bash
git checkout -- filename.js
```

---

## 📊 GITHUB FEATURES TO USE

1. **Issues** - Track bugs dan feature requests
2. **Projects** - Kanban board untuk task management
3. **Wiki** - Documentation
4. **Actions** - CI/CD automation
5. **Releases** - Version tagging

---

## 🚀 NEXT STEPS

Setelah push ke GitHub:

1. ✅ Setup GitHub Actions untuk auto-deployment
2. ✅ Add collaborators (jika team project)
3. ✅ Create project board untuk task tracking
4. ✅ Setup branch protection rules
5. ✅ Add badges ke README (build status, etc)

---

## 📞 SUPPORT

Jika ada masalah:
1. Check GitHub documentation: https://docs.github.com
2. Stack Overflow: https://stackoverflow.com/questions/tagged/git
3. Git documentation: https://git-scm.com/doc

---

**Happy Coding! 🎉**
