# 🌾 ERP Daya Padi Abadi

> Modern ERP Manufacturing System for Rice Mill Industry

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Deskripsi

ERP Daya Padi Abadi adalah sistem Enterprise Resource Planning (ERP) yang dirancang khusus untuk industri penggilingan padi. Sistem ini menyediakan solusi terintegrasi untuk mengelola produksi, penjualan, keuangan, dan sumber daya manusia.

### ✨ Fitur Utama

- 🏭 **Production Management** - Kelola worksheet, performance, OEE, uptime/downtime
- 📦 **Stock Management** - Manajemen inventori dan stok real-time
- 💰 **Finance Management** - Pengeluaran harian dan analisis COGM
- 👥 **HRD Management** - Kehadiran, performa, dan demografi karyawan
- 📊 **Sales Management** - Revenue tracking dan invoice management
- 🔄 **Real-time Sync** - Sinkronisasi data dengan Supabase
- 🌐 **Multi-language** - Support Bahasa Indonesia & English
- 📱 **Responsive Design** - Clean & modern UI dengan emerald theme

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm atau yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/username/erp-daya-padi-abadi.git

# Masuk ke direktori project
cd erp-daya-padi-abadi

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env dengan credentials Supabase Anda (optional)
nano .env

# Run development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 🏗️ Tech Stack

### Frontend
- **React 18.3** - UI Library
- **Vite 7.3** - Build Tool & Dev Server
- **TailwindCSS 3.4** - Utility-first CSS
- **React Router 7.1** - Client-side Routing
- **Lucide React** - Icon Library
- **i18next** - Internationalization

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **localStorage** - Fallback storage

### State Management
- **React Context API** - Global state
- **Custom Hooks** - Reusable logic

## 📁 Project Structure

```
erp-daya-padi-abadi/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, logos
│   ├── components/     # Reusable components
│   │   ├── layout/    # Layout components (Sidebar, Header)
│   │   ├── shared/    # Shared forms
│   │   └── ui/        # UI components (Button, Modal, etc)
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom hooks
│   ├── i18n/          # Translations
│   ├── lib/           # Utilities & helpers
│   ├── pages/         # Page components
│   ├── services/      # API & data services
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── .env.example       # Environment variables template
├── package.json       # Dependencies
└── vite.config.js     # Vite configuration
```

## 🎨 Features Detail

### 1. Double Sidebar Navigation
- **Icon Sidebar** (Left): Quick access to main modules
- **Detail Sidebar** (Center): Detailed navigation for each module
- **Collapsible**: Space-efficient design

### 2. Dashboard Quick Actions
Shortcuts untuk akses cepat:
- Input Worksheet
- Manajemen Stok
- Input Pengeluaran
- Input Kehadiran
- Input Penjualan

### 3. Production Module
- Worksheet Management
- Performance Tracking
- OEE Calculation
- Uptime/Downtime Monitoring
- Stock Management
- Maintenance Tracking
- COGM Analysis

### 4. Sales Module
- Revenue Tracking
- Invoice Management
- PIC (Person in Charge) Management

### 5. Finance Module
- Daily Expenses
- COGM Analysis
- Cost Reports

### 6. HRD Module
- Attendance Management
- Employee Performance
- Demographics

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# Supabase Configuration (Optional)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
VITE_APP_NAME=ERP Daya Padi Abadi
VITE_APP_VERSION=1.0.0
```

### Supabase Setup

Jika ingin menggunakan Supabase:

1. Buat project di [Supabase](https://supabase.com)
2. Jalankan SQL schema dari `supabase-schema.sql`
3. Copy URL dan Anon Key ke `.env`
4. Restart dev server

Lihat [SUPABASE_SETUP.md](SUPABASE_SETUP.md) untuk detail lengkap.

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint

# GitHub Sync
./sync-github.sh     # Auto sync with GitHub
```

## 🔐 Authentication

### Demo Accounts

**Administrator:**
- Email: `admin@dayapadi.com`
- Password: `admin123`

**Manager:**
- Email: `manager@dayapadi.com`
- Password: `manager123`

**Operator:**
- Email: `operator@dayapadi.com`
- Password: `operator123`

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Deploy dist folder to Netlify
```

## 🔄 GitHub Synchronization

### Setup Git

```bash
# Configure user
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Add remote
git remote add origin https://github.com/username/erp-daya-padi-abadi.git

# Push
git push -u origin main
```

### Quick Sync

```bash
# Use automated script
./sync-github.sh
```

Lihat [GITHUB_SYNC_GUIDE.md](GITHUB_SYNC_GUIDE.md) untuk panduan lengkap.

## 📚 Documentation

- [Supabase Setup Guide](SUPABASE_SETUP.md)
- [GitHub Sync Guide](GITHUB_SYNC_GUIDE.md)
- [Migration Guide](MIGRATION_GUIDE.md)
- [Data Audit](AUDIT_DATA_SEPARATION.md)
- [Stock Integration](STOCK_INTEGRATION.md)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Daya Padi Abadi Development Team**

## 📞 Support

For support, email support@dayapadi.com or create an issue in this repository.

## 🙏 Acknowledgments

- React Team for amazing framework
- Supabase for backend infrastructure
- Lucide for beautiful icons
- TailwindCSS for utility-first CSS

---

**Made with ❤️ for Daya Padi Abadi**

**Version:** 1.0.0  
**Last Updated:** 2026-01-14
