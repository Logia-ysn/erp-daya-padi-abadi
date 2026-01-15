# Migration Guide: localStorage to Supabase

## Cara Migrasi Halaman dari localStorage ke Supabase

### Langkah 1: Import Hook Baru

**Sebelum:**
```javascript
import { useCrud, useModal, useConfirm } from '@/hooks/useCrud';
import { STORAGE_KEYS } from '@/services/api';
import { mockDowntime } from '@/services/mockDataModules';
```

**Sesudah:**
```javascript
import { useSupabaseCrud, useModal, useConfirm } from '@/hooks/useSupabaseCrud';
import { TABLES } from '@/services/supabaseService';
import { mockDowntime } from '@/services/mockDataModules';
```

### Langkah 2: Update Hook Usage

**Sebelum:**
```javascript
const { items: downtimeRecords, isLoading, create, update, remove } = useCrud(
    STORAGE_KEYS.DOWNTIME, 
    mockDowntime
);
```

**Sesudah:**
```javascript
const { items: downtimeRecords, isLoading, create, update, remove, isSupabase } = useSupabaseCrud(
    TABLES.DOWNTIME,           // Supabase table name
    'erp_downtime',            // localStorage key (fallback)
    mockDowntime,              // Initial data
    { realtime: true }         // Enable real-time updates
);
```

### Langkah 3: Update Data Fields (Jika Perlu)

Supabase menggunakan `created_at` dan `updated_at` (snake_case), sedangkan localStorage menggunakan `createdAt` dan `updatedAt` (camelCase).

**Opsi 1: Normalisasi di Component**
```javascript
const normalizedRecords = downtimeRecords.map(record => ({
    ...record,
    createdAt: record.created_at || record.createdAt,
    updatedAt: record.updated_at || record.updatedAt,
}));
```

**Opsi 2: Update Service Layer** (Recommended)
Service layer sudah handle konversi otomatis.

### Langkah 4: Tambahkan Indikator Supabase (Opsional)

Tampilkan badge untuk menunjukkan data source:

```javascript
{isSupabase && (
    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
        🟢 Live (Supabase)
    </span>
)}
```

---

## Contoh Lengkap: DowntimePage Migration

### File: `src/pages/production/DowntimePage.jsx`

**Perubahan Minimal:**

```javascript
// 1. Update imports
import { useSupabaseCrud, useModal, useConfirm } from '@/hooks/useSupabaseCrud';
import { TABLES } from '@/services/supabaseService';

// 2. Update hook
const DowntimePage = () => {
    const { 
        items: downtimeRecords, 
        isLoading, 
        create, 
        update, 
        remove,
        isSupabase,
        refresh 
    } = useSupabaseCrud(
        TABLES.DOWNTIME,
        'erp_downtime',
        mockDowntime,
        { realtime: true }
    );

    // Rest of the component remains the same!
    // ...
};
```

**Itu saja!** Komponen akan otomatis:
- ✅ Menggunakan Supabase jika sudah dikonfigurasi
- ✅ Fallback ke localStorage jika belum
- ✅ Mendapatkan real-time updates (jika enabled)
- ✅ Seed data awal jika database kosong

---

## Migrasi Semua Halaman

### Mapping Table Names

| Page | Old (STORAGE_KEYS) | New (TABLES) | localStorage Key |
|------|-------------------|--------------|------------------|
| DowntimePage | STORAGE_KEYS.DOWNTIME | TABLES.DOWNTIME | 'erp_downtime' |
| StockPage | STORAGE_KEYS.STOCK | TABLES.STOCK | 'erp_stock' |
| MaintenancePage | STORAGE_KEYS.MAINTENANCE_SCHEDULE | TABLES.MAINTENANCE_SCHEDULE | 'erp_maintenance_schedule' |
| InvoicesPage | STORAGE_KEYS.INVOICES | TABLES.INVOICES | 'erp_invoices' |
| PicPage | STORAGE_KEYS.PIC | TABLES.PIC | 'erp_pic' |
| ExpensesPage | STORAGE_KEYS.EXPENSES | TABLES.EXPENSES | 'erp_expenses' |
| AttendancePage | STORAGE_KEYS.ATTENDANCE | TABLES.ATTENDANCE | 'erp_attendance' |
| DemographyPage | STORAGE_KEYS.EMPLOYEES | TABLES.EMPLOYEES | 'erp_employees' |

### Script untuk Batch Migration

Buat file `scripts/migrate-to-supabase.sh`:

```bash
#!/bin/bash

# Find and replace in all page files
find src/pages -name "*.jsx" -type f -exec sed -i \
  -e 's/from.*useCrud.*/from "@\/hooks\/useSupabaseCrud";/g' \
  -e 's/STORAGE_KEYS/TABLES/g' \
  {} \;

echo "Migration complete! Please review changes."
```

---

## Testing Migration

### 1. Test dengan localStorage (Tanpa Supabase)

```bash
# Jangan set environment variables
npm run dev
```

Aplikasi harus tetap berfungsi normal dengan localStorage.

### 2. Test dengan Supabase

```bash
# Set environment variables
echo "VITE_SUPABASE_URL=https://xxx.supabase.co" > .env
echo "VITE_SUPABASE_ANON_KEY=xxx" >> .env

npm run dev
```

Aplikasi harus:
- ✅ Connect ke Supabase
- ✅ Load data dari database
- ✅ CRUD operations work
- ✅ Real-time updates work (jika enabled)

### 3. Test Real-time

Buka 2 browser tabs:

**Tab 1:**
1. Tambah data baru

**Tab 2:**
2. Data otomatis muncul tanpa refresh!

---

## Rollback Plan

Jika ada masalah, rollback mudah:

### Opsi 1: Disable Supabase
```bash
# Hapus atau comment environment variables
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...

npm run dev
```

### Opsi 2: Revert Code
```bash
git checkout -- src/pages/
```

### Opsi 3: Keep Both
Hook `useSupabaseCrud` sudah handle fallback otomatis, jadi tidak perlu rollback code.

---

## Performance Considerations

### Pagination

Untuk dataset besar, gunakan pagination:

```javascript
const { items, isLoading } = useSupabaseCrud(
    TABLES.DOWNTIME,
    'erp_downtime',
    mockDowntime,
    { 
        realtime: true,
        limit: 50,  // Limit results
        offset: 0   // Pagination offset
    }
);
```

### Selective Fields

Jika tidak perlu semua field:

```javascript
// Modify supabaseService.js getAll method
getAll: async (filters = {}, select = '*') => {
    let query = supabase.from(tableName).select(select);
    // ...
}
```

---

## Troubleshooting

### Data tidak sync

**Solusi:**
1. Check real-time enabled di Supabase dashboard
2. Verify RLS policies
3. Check browser console untuk errors

### Duplicate data

**Solusi:**
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Data akan load dari Supabase

### Slow performance

**Solusi:**
1. Add indexes di Supabase (sudah ada di schema)
2. Enable pagination
3. Use selective field selection

---

**Migration checklist:**

- [ ] Install `@supabase/supabase-js`
- [ ] Create Supabase project
- [ ] Run SQL schema
- [ ] Create `.env` file
- [ ] Update imports di pages
- [ ] Update hook usage
- [ ] Test dengan localStorage
- [ ] Test dengan Supabase
- [ ] Test real-time updates
- [ ] Deploy to production

Happy migrating! 🚀
