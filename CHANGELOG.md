# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan di file ini.

## [0.2.0] - 2026-01-15

### ✨ Fitur Baru

#### Production Worksheet - Pengemasan
- **Tracking Karung/Jumbobag**: Input jumlah karung atau jumbobag pada hasil produksi
- **Jenis Kemasan**: Pilihan antara Karung dan Jumbo Bag
- **Auto-kalkulasi**: Berat per karung otomatis dihitung (contoh: 9000 kg ÷ 300 karung = 30 kg/karung)
- **Ringkasan Pengemasan**: Tampilan ringkasan produksi dengan detail kemasan

#### Production Worksheet - Quality & OEE
- **Quality Rate Input**: Input persentase kualitas produksi (0-100%)
- **OEE Calculator**: Perhitungan OEE otomatis dengan formula:
  - Availability = (Waktu Kerja - Istirahat - Downtime) / (Waktu Kerja - Istirahat)
  - Performance = Aktual Produksi / Target Produksi
  - Quality = Input dari user
  - OEE = Availability × Performance × Quality
- **Visual Indicator OEE**: Warna hijau (≥85%), kuning (70-84%), merah (<70%)
- **Formula Breakdown**: Tampilan detail perhitungan di form

#### Integrasi Stok
- **Stok dengan Karung**: Data stok menampilkan kg dan jumlah karung
- **Kolom Karung/Bag**: Tabel stok menampilkan kemasan per item
- **Berat per Karung**: Informasi kg/karung ditampilkan di stok

### 🎨 UI/UX
- **Logo Perusahaan**: Favicon diganti dengan logo padi
- **Nama Aplikasi**: Title browser diubah menjadi "ERP Daya Padi Abadi"
- **Kolom Karung di Tabel**: Worksheets table dan Stock table menampilkan kolom karung

### 🐛 Perbaikan
- **Logic OEE**: Perbaikan rumus perhitungan Availability sesuai standar
- **Performance >100%**: Performance dapat melebihi 100% jika produksi melampaui target

---

## [0.1.0] - 2026-01-15

### ✨ Fitur Baru
- **Manajemen Mesin dengan Kategori**: Pemisahan mesin utama produksi dan mesin support
  - Filter tabs: Semua Mesin / Mesin Produksi / Mesin Support
  - Summary cards per kategori dengan jumlah unit
  - Visual indicator (border warna) untuk membedakan kategori
  - Badge kategori pada setiap kartu mesin (⚙️ Produksi / 🔧 Support)

### 🔧 Peningkatan
- UI halaman Maintenance lebih informatif dengan statistik per kategori
- Tampilan empty state ketika tidak ada mesin ditemukan
- Lokalisasi label ke Bahasa Indonesia

### 📦 Dependencies
- Homebrew & Node.js v25.3.0 terinstal untuk development environment
