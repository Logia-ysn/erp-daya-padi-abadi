# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan di file ini.

## [0.3.1] - 2026-01-15

### ✨ Fitur Baru

#### Factory Data Separation (Like Excel Filter)
- **`useFactoryCrud` Hook**: Hook baru untuk data filtering per factory
- **Auto-inject factoryId**: Setiap record baru otomatis memiliki factoryId
- **Filter otomatis**: Ketika switch factory, data langsung terfilter

#### Modul yang Di-sync:
- WorksheetPage - Worksheet terpisah per factory
- StockPage - Stok terpisah per factory
- MaintenancePage - Mesin terpisah per factory
- InventoryPage - Inventory terpisah per factory
- ProcurementPage - Supplier & PO terpisah per factory
- SalesPage - Customer & Sales Order terpisah per factory

### 🔧 Behavior
| Aksi | Hasil |
|------|-------|
| Switch Factory | Data refresh dengan filter factory baru |
| Create Record | `factoryId` otomatis ditambahkan |
| View/Edit | Hanya tampil data factory aktif |

---

## [0.3.0] - 2026-01-15

### ✨ Fitur Baru

#### Multi-Factory System
- **Factory Selector**: Dropdown di header untuk memilih factory aktif
- **Factory Management**: Tambah factory baru (contoh: Factory Subang, Factory Indramayu)
- **Data Terpisah**: Setiap factory memiliki data tersendiri
- **Factory Context**: State management untuk multi-factory
- **Default Factories**: PT Daya Padi Abadi - Factory Subang & Indramayu

#### Downtime Management (Enhanced)
- **Downtime Type**: Kategori jenis downtime:
  - Preventive (biru) - Perawatan pencegahan
  - Planned (hijau) - Downtime terencana  
  - Corrective (merah) - Perbaikan kerusakan
- **Expanded Categories**: 14 kategori downtime:
  - Mechanical Failure, Electrical Issue, Material Shortage
  - Setup/Changeover, Tooling Change, Cleaning
  - Lubrication, Inspection, Calibration
  - Operator Issue, Quality Control, Waiting
  - Power Outage, Other
- **Visual Badge**: Type ditampilkan dengan warna yang sesuai

### 🔧 Peningkatan
- Layout downtime input form diperluas menjadi 6 kolom
- Downtime list menampilkan Type dengan badge warna

---

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
