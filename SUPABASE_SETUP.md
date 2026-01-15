# Integrasi Supabase - ERP Daya Padi Abadi

## 📋 Daftar Isi
1. [Setup Supabase Project](#setup-supabase-project)
2. [Konfigurasi Database](#konfigurasi-database)
3. [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
4. [Migrasi dari localStorage ke Supabase](#migrasi-dari-localstorage-ke-supabase)
5. [Fitur Real-time](#fitur-real-time)
6. [Testing](#testing)

---

## 🚀 Setup Supabase Project

### 1. Buat Project Baru di Supabase

1. Kunjungi [https://supabase.com](https://supabase.com)
2. Sign in atau buat akun baru
3. Klik **"New Project"**
4. Isi detail project:
   - **Name**: `erp-daya-padi-abadi`
   - **Database Password**: (simpan password ini dengan aman)
   - **Region**: Pilih region terdekat (Singapore untuk Indonesia)
5. Klik **"Create new project"**
6. Tunggu beberapa menit hingga project selesai dibuat

### 2. Dapatkan API Credentials

Setelah project dibuat:

1. Buka **Settings** → **API**
2. Copy nilai berikut:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🗄️ Konfigurasi Database

### 1. Jalankan SQL Schema

1. Buka **SQL Editor** di dashboard Supabase
2. Klik **"New query"**
3. Copy seluruh isi file `supabase-schema.sql`
4. Paste ke SQL Editor
5. Klik **"Run"** atau tekan `Ctrl+Enter`
6. Tunggu hingga semua tabel berhasil dibuat

### 2. Verifikasi Tabel

1. Buka **Table Editor**
2. Pastikan semua tabel berikut sudah ada:
   - ✅ suppliers
   - ✅ customers
   - ✅ machines
   - ✅ inventory
   - ✅ downtime
   - ✅ stock
   - ✅ maintenance_schedule
   - ✅ production
   - ✅ sales_orders
   - ✅ invoices
   - ✅ pic
   - ✅ expenses
   - ✅ purchase_orders
   - ✅ employees
   - ✅ attendance
   - ✅ maintenance

---

## ⚙️ Konfigurasi Environment Variables

### 1. Buat File `.env`

Di root project, buat file `.env` (copy dari `.env.example`):

```bash
cp .env.example .env
```

### 2. Isi Environment Variables

Edit file `.env` dan isi dengan credentials Supabase Anda:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **PENTING**: 
- Jangan commit file `.env` ke Git
- File `.env` sudah ada di `.gitignore`
- Gunakan `.env.example` sebagai template

### 3. Restart Development Server

```bash
npm run dev
```

---

## 🔄 Migrasi dari localStorage ke Supabase

Aplikasi ini **otomatis** menggunakan Supabase jika sudah dikonfigurasi, dan fallback ke localStorage jika belum.

### Cara Kerja Auto-Detection

```javascript
// Di supabaseService.js
const useSupabase = isSupabaseConfigured();

if (useSupabase) {
    // Gunakan Supabase
} else {
    // Gunakan localStorage
}
```

### Migrasi Data Manual (Opsional)

Jika Anda ingin memindahkan data dari localStorage ke Supabase:

1. Export data dari localStorage:
```javascript
// Di browser console
const data = {
    downtime: JSON.parse(localStorage.getItem('erp_downtime')),
    stock: JSON.parse(localStorage.getItem('erp_stock')),
    // ... dst untuk semua keys
};
console.log(JSON.stringify(data, null, 2));
```

2. Import ke Supabase menggunakan SQL Editor atau Table Editor

---

## 🔴 Fitur Real-time

Supabase mendukung real-time updates. Contoh penggunaan:

### Subscribe to Changes

```javascript
import { supabaseServices } from '@/services/supabaseService';

// Subscribe to downtime changes
const subscription = supabaseServices.downtime.subscribe((payload) => {
    console.log('Change received!', payload);
    
    if (payload.eventType === 'INSERT') {
        console.log('New record:', payload.new);
    } else if (payload.eventType === 'UPDATE') {
        console.log('Updated record:', payload.new);
    } else if (payload.eventType === 'DELETE') {
        console.log('Deleted record:', payload.old);
    }
    
    // Refresh your data
    refreshData();
});

// Cleanup on unmount
return () => {
    supabaseServices.downtime.unsubscribe(subscription);
};
```

### Contoh di React Component

```javascript
useEffect(() => {
    const subscription = supabaseServices.downtime.subscribe(() => {
        // Refresh data when changes occur
        refresh();
    });

    return () => {
        supabaseServices.downtime.unsubscribe(subscription);
    };
}, []);
```

---

## 🧪 Testing

### 1. Test Koneksi

Buka browser console dan jalankan:

```javascript
import { isSupabaseConfigured } from '@/lib/supabase';
console.log('Supabase configured:', isSupabaseConfigured());
```

### 2. Test CRUD Operations

```javascript
import { supabaseServices } from '@/services/supabaseService';

// Create
const newRecord = await supabaseServices.downtime.create({
    machine: 'Pellet Mill #1',
    type: 'Unplanned',
    reason: 'Test',
    start_time: new Date().toISOString(),
    end_time: new Date().toISOString(),
    duration: 2,
    technician: 'Test',
});

// Read
const all = await supabaseServices.downtime.getAll();
console.log('All records:', all);

// Update
await supabaseServices.downtime.update(newRecord.id, {
    reason: 'Updated Test'
});

// Delete
await supabaseServices.downtime.delete(newRecord.id);
```

---

## 🔒 Security Best Practices

### Row Level Security (RLS)

Schema sudah include RLS policies. Untuk production:

1. **Enable Authentication**:
   - Buka **Authentication** → **Providers**
   - Enable Email/Password atau OAuth providers

2. **Customize RLS Policies**:
   - Edit policies di SQL Editor sesuai kebutuhan
   - Contoh: Batasi akses berdasarkan role user

```sql
-- Contoh: Hanya admin yang bisa delete
CREATE POLICY "Only admin can delete" ON downtime
    FOR DELETE
    USING (auth.jwt() ->> 'role' = 'admin');
```

### Environment Variables di Production

Untuk deployment (Vercel, Netlify, dll):

1. Tambahkan environment variables di dashboard hosting
2. Jangan expose API keys di client-side code
3. Gunakan Supabase Service Role key untuk server-side operations

---

## 📊 Monitoring

### Supabase Dashboard

Monitor penggunaan di:
- **Database** → **Usage**: Lihat storage dan bandwidth
- **API** → **Logs**: Monitor API requests
- **Auth** → **Users**: Manage users

### Performance Tips

1. **Indexes**: Schema sudah include indexes untuk query performance
2. **Pagination**: Gunakan `.range()` untuk large datasets
3. **Select specific columns**: Jangan select `*` jika tidak perlu

```javascript
// Good
const { data } = await supabase
    .from('downtime')
    .select('id, machine, reason')
    .range(0, 9);

// Avoid
const { data } = await supabase
    .from('downtime')
    .select('*');
```

---

## 🆘 Troubleshooting

### Error: "Failed to fetch"

**Solusi**:
1. Check internet connection
2. Verify Supabase project URL
3. Check CORS settings di Supabase dashboard

### Error: "Invalid API key"

**Solusi**:
1. Verify anon key di `.env`
2. Restart dev server setelah update `.env`
3. Check key tidak ada extra spaces

### Data tidak muncul

**Solusi**:
1. Check RLS policies
2. Verify authentication status
3. Check browser console untuk errors

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

---

## ✅ Checklist Setup

- [ ] Buat Supabase project
- [ ] Copy API credentials
- [ ] Jalankan SQL schema
- [ ] Buat file `.env`
- [ ] Isi environment variables
- [ ] Restart dev server
- [ ] Test koneksi
- [ ] Test CRUD operations
- [ ] Setup authentication (optional)
- [ ] Deploy to production

---

**Happy coding! 🚀**
