# Integrasi Stok Otomatis dari Worksheet Produksi

## Deskripsi
Fitur ini mengintegrasikan hasil produksi dari worksheet dengan manajemen stok secara otomatis. Ketika worksheet produksi dibuat, diupdate, atau dihapus, stok item barang jadi akan otomatis diperbarui.

## Cara Kerja

### 1. Pembuatan Worksheet Baru
Ketika worksheet produksi baru dibuat dengan status **"completed"**:
- Sistem akan menambahkan `actualProduction` (dalam kg) ke stok item **Pellet Curah (FG-002)**
- Sistem akan mencatat pergerakan stok (stock movement) untuk tracking

**Contoh:**
- Worksheet baru: Actual Production = 4850 kg
- Stok Pellet Curah sebelumnya: 25000 kg
- Stok Pellet Curah setelah: 29850 kg

### 2. Update Worksheet
Ketika worksheet yang sudah ada diupdate:
- Sistem akan menghitung selisih antara `actualProduction` lama dan baru
- Stok akan disesuaikan berdasarkan selisih tersebut
- Hanya worksheet dengan status **"completed"** yang akan mempengaruhi stok

**Contoh:**
- Actual Production lama: 4850 kg
- Actual Production baru: 5000 kg
- Selisih: +150 kg
- Stok akan bertambah 150 kg

### 3. Penghapusan Worksheet
Ketika worksheet dihapus:
- Sistem akan mengurangi stok sebesar `actualProduction` dari worksheet yang dihapus
- Hanya worksheet dengan status **"completed"** yang akan mempengaruhi stok

**Contoh:**
- Worksheet yang dihapus: Actual Production = 4850 kg
- Stok akan berkurang 4850 kg

## File yang Terlibat

### 1. `/src/services/stockIntegration.js`
Service utama yang menangani integrasi stok:
- `updateStockFromWorksheet()` - Update stok saat worksheet dibuat/diupdate
- `removeStockFromWorksheet()` - Kurangi stok saat worksheet dihapus
- `createStockMovement()` - Catat pergerakan stok untuk audit trail
- `getStockMovements()` - Ambil riwayat pergerakan stok

### 2. `/src/pages/production/WorksheetPage.jsx`
Halaman worksheet yang sudah dimodifikasi:
- `handleSubmit()` - Memanggil `updateStockFromWorksheet()` setelah save
- `handleDelete()` - Memanggil `removeStockFromWorksheet()` sebelum delete

### 3. `/src/services/api.js`
Ditambahkan storage key baru:
- `STOCK_MOVEMENTS: 'erp_stock_movements'` - Untuk menyimpan riwayat pergerakan stok

### 4. `/src/services/mockDataModules.js`
Ditambahkan item stok baru:
- **Pellet Curah (FG-002)** - Item barang jadi yang menerima hasil produksi

## Konfigurasi

### Item Stok Target
Saat ini sistem dikonfigurasi untuk menambahkan hasil produksi ke item:
- **Code**: FG-002
- **Name**: Pellet Curah
- **Category**: finished
- **Unit**: kg

Untuk mengubah item target, edit file `/src/services/stockIntegration.js`:

```javascript
const finishedGoodsItem = stockItems.find(item => 
    item.category === 'finished' && item.code === 'FG-002' // Ubah code di sini
);
```

### Status Worksheet
Hanya worksheet dengan status **"completed"** yang akan mempengaruhi stok. Worksheet dengan status "pending" atau "in_progress" tidak akan mengubah stok.

## Stock Movement Tracking

Setiap perubahan stok akan dicatat dalam `erp_stock_movements` dengan informasi:
- `itemId` - ID item yang berubah
- `itemName` - Nama item
- `type` - Tipe pergerakan ('production' atau 'adjustment')
- `quantity` - Jumlah perubahan (positif = tambah, negatif = kurang)
- `unit` - Satuan
- `reference` - Nomor worksheet
- `date` - Tanggal produksi
- `notes` - Catatan tambahan
- `createdAt` - Timestamp pencatatan

## Testing

### Test Case 1: Buat Worksheet Baru (Completed)
1. Buka halaman Production > Worksheets
2. Klik "New Worksheet"
3. Isi form dengan status "Completed" dan Actual Production = 5000 kg
4. Simpan worksheet
5. Buka halaman Production > Manajemen Stok
6. Cek item "Pellet Curah" - stok harus bertambah 5000 kg

### Test Case 2: Update Worksheet
1. Edit worksheet yang sudah ada
2. Ubah Actual Production dari 5000 kg menjadi 5500 kg
3. Simpan perubahan
4. Cek stok "Pellet Curah" - harus bertambah 500 kg

### Test Case 3: Hapus Worksheet
1. Hapus worksheet dengan Actual Production = 5500 kg
2. Cek stok "Pellet Curah" - harus berkurang 5500 kg

### Test Case 4: Worksheet In Progress (Tidak Mempengaruhi Stok)
1. Buat worksheet baru dengan status "In Progress"
2. Isi Actual Production = 3000 kg
3. Simpan worksheet
4. Cek stok "Pellet Curah" - stok TIDAK berubah

## Troubleshooting

### Stok tidak berubah setelah save worksheet
**Kemungkinan penyebab:**
1. Status worksheet bukan "completed"
2. Item "Pellet Curah (FG-002)" tidak ada di stok
3. Error di console browser

**Solusi:**
1. Pastikan status worksheet adalah "completed"
2. Cek console browser untuk error message
3. Pastikan item FG-002 ada di localStorage dengan key `erp_stock`

### Stok berubah dua kali
**Kemungkinan penyebab:**
- Function dipanggil dua kali (React strict mode di development)

**Solusi:**
- Ini normal di development mode
- Di production mode tidak akan terjadi

## Future Enhancements

1. **Multi-Product Support**: Mendukung berbagai jenis produk hasil produksi
2. **Raw Material Deduction**: Otomatis mengurangi bahan baku saat produksi
3. **Batch Tracking**: Tracking nomor batch untuk traceability
4. **Quality Control Integration**: Hanya produk yang lolos QC yang masuk stok
5. **Real-time Notifications**: Notifikasi saat stok berubah
6. **Stock Movement Report**: Laporan lengkap pergerakan stok

## Catatan Penting

⚠️ **PENTING**: 
- Fitur ini bekerja dengan localStorage. Jika localStorage dihapus, riwayat pergerakan stok akan hilang
- Untuk production, disarankan menggunakan Supabase atau database lain untuk persistence
- Pastikan backup data secara berkala

## Kontak
Untuk pertanyaan atau issue terkait fitur ini, silakan hubungi tim development.
