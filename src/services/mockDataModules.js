/**
 * Mock Data for Production, Sales, Finance, and HRD Modules
 */

// Production Module - Downtime Records
export const mockDowntime = [
    {
        id: 'dt_001',
        machine: 'Pellet Mill #1',
        type: 'Planned',
        reason: 'Preventive Maintenance',
        startTime: '2026-01-10T08:00:00',
        endTime: '2026-01-10T12:00:00',
        duration: 4,
        technician: 'Pak Ridwan',
        notes: 'Servis rutin bulanan',
        status: 'completed'
    },
    {
        id: 'dt_002',
        machine: 'Pellet Mill #3',
        type: 'Unplanned',
        reason: 'Dies Aus',
        startTime: '2026-01-08T14:00:00',
        endTime: '2026-01-09T10:00:00',
        duration: 20,
        technician: 'Pak Eko',
        notes: 'Ganti dies baru',
        status: 'completed'
    },
    {
        id: 'dt_003',
        machine: 'Dryer Unit',
        type: 'Planned',
        reason: 'Servis Rutin',
        startTime: '2026-01-07T06:00:00',
        endTime: '2026-01-07T09:00:00',
        duration: 3,
        technician: 'Pak Budi',
        notes: 'Cleaning dan pengecekan',
        status: 'completed'
    },
];

// Production Module - Stock Items
export const mockStock = [
    { id: 'stk_001', code: 'RM-001', name: 'Sekam Padi Basah', category: 'raw', stock: 15000, minStock: 5000, maxStock: 50000, unit: 'kg', location: 'Gudang A', pricePerUnit: 800 },
    { id: 'stk_002', code: 'RM-002', name: 'Sekam Padi Kering', category: 'raw', stock: 8500, minStock: 3000, maxStock: 30000, unit: 'kg', location: 'Gudang A', pricePerUnit: 1000 },
    { id: 'stk_003', code: 'RM-003', name: 'Sekam Tongkol Jagung', category: 'raw', stock: 2000, minStock: 3000, maxStock: 20000, unit: 'kg', location: 'Gudang A', pricePerUnit: 900 },
    { id: 'stk_004', code: 'WIP-001', name: 'Pellet Pre-Dry', category: 'wip', stock: 1200, minStock: 500, maxStock: 5000, unit: 'kg', location: 'Produksi', pricePerUnit: 1500 },
    { id: 'stk_005', code: 'FG-001', name: 'Pellet Karung 50kg', category: 'finished', stock: 450, minStock: 100, maxStock: 2000, unit: 'karung', location: 'Gudang B', pricePerUnit: 110000 },
    { id: 'stk_006', code: 'FG-002', name: 'Pellet Curah', category: 'finished', stock: 25000, minStock: 5000, maxStock: 100000, unit: 'kg', location: 'Gudang B', pricePerUnit: 2200 },
    { id: 'stk_007', code: 'SP-001', name: 'Dies 8mm', category: 'sparepart', stock: 3, minStock: 2, maxStock: 10, unit: 'pcs', location: 'Gudang C', pricePerUnit: 8500000 },
    { id: 'stk_008', code: 'SP-002', name: 'Roller Assembly', category: 'sparepart', stock: 4, minStock: 2, maxStock: 8, unit: 'pcs', location: 'Gudang C', pricePerUnit: 12000000 },
];

// Production Module - Maintenance Schedule
export const mockMaintenanceSchedule = [
    { id: 'ms_001', machine: 'Pellet Mill #1', type: 'Preventive', task: 'Servis Rutin', scheduledDate: '2026-01-15', status: 'upcoming', technician: 'Pak Ridwan', estimatedDuration: 4, notes: 'Servis bulanan' },
    { id: 'ms_002', machine: 'Pellet Mill #2', type: 'Preventive', task: 'Ganti Oli', scheduledDate: '2026-01-20', status: 'upcoming', technician: 'Pak Eko', estimatedDuration: 2, notes: 'Ganti oli mesin' },
    { id: 'ms_003', machine: 'Pellet Mill #3', type: 'Corrective', task: 'Ganti Dies', scheduledDate: '2026-01-10', status: 'in_progress', technician: 'Pak Ridwan', estimatedDuration: 8, notes: 'Dies rusak' },
    { id: 'ms_004', machine: 'Dryer Unit', type: 'Preventive', task: 'Cleaning Filter', scheduledDate: '2026-01-25', status: 'upcoming', technician: 'Pak Budi', estimatedDuration: 3, notes: 'Cleaning rutin' },
    { id: 'ms_005', machine: 'Hammer Mill', type: 'Preventive', task: 'Cek Bearing', scheduledDate: '2026-02-01', status: 'upcoming', technician: 'Pak Yanto', estimatedDuration: 2, notes: 'Pengecekan berkala' },
];

// Sales Module - Invoices
export const mockInvoices = [
    { id: 'inv_001', number: 'INV-2026-001', customerId: 'cust_001', customerName: 'PT PLN Pembangkitan Jawa-Bali', date: '2026-01-02', dueDate: '2026-02-01', amount: 110000000, status: 'pending', soNumber: 'SO-2026-001', items: [] },
    { id: 'inv_002', number: 'INV-2026-002', customerId: 'cust_002', customerName: 'PT Semen Indonesia', date: '2026-01-05', dueDate: '2026-02-19', amount: 64500000, status: 'pending', soNumber: 'SO-2026-002', items: [] },
    { id: 'inv_003', number: 'INV-2025-089', customerId: 'cust_003', customerName: 'Toko Biomassa Jaya', date: '2025-12-28', dueDate: '2025-12-28', amount: 2500000, status: 'paid', soNumber: 'SO-2025-089', items: [] },
    { id: 'inv_004', number: 'INV-2025-088', customerId: 'cust_001', customerName: 'PT PLN Pembangkitan Jawa-Bali', date: '2025-12-15', dueDate: '2026-01-14', amount: 95000000, status: 'overdue', soNumber: 'SO-2025-088', items: [] },
];

// Sales Module - PIC (Person In Charge)
export const mockPic = [
    { id: 'pic_001', name: 'Ir. Bambang Sutrisno', customerId: 'cust_001', customerName: 'PT PLN Pembangkitan Jawa-Bali', position: 'Procurement Manager', phone: '021-725-1234', email: 'bambang.s@pln.co.id', lastContact: '2026-01-10', status: 'active' },
    { id: 'pic_002', name: 'Andi Prasetyo', customerId: 'cust_002', customerName: 'PT Semen Indonesia', position: 'Purchasing Head', phone: '031-398-1234', email: 'andi.p@semenindonesia.com', lastContact: '2026-01-08', status: 'active' },
    { id: 'pic_003', name: 'Pak Herman', customerId: 'cust_003', customerName: 'CV Pabrik Tahu Murni', position: 'Owner', phone: '022-731-5678', email: 'herman@tahumurni.com', lastContact: '2025-12-28', status: 'active' },
    { id: 'pic_004', name: 'Bu Siti', customerId: 'cust_004', customerName: 'Toko Biomassa Jaya', position: 'Manager', phone: '0817-1234-5678', email: 'siti@biomassajaya.com', lastContact: '2025-12-20', status: 'inactive' },
];

// Finance Module - Expenses
export const mockExpenses = [
    { id: 'exp_001', date: '2026-01-12', category: 'Bahan Baku', description: 'Pembelian sekam padi', amount: 6400000, paymentMethod: 'Transfer', status: 'paid', vendor: 'Penggilingan Padi Makmur' },
    { id: 'exp_002', date: '2026-01-11', category: 'Listrik', description: 'Tagihan PLN Januari', amount: 3200000, paymentMethod: 'Transfer', status: 'paid', vendor: 'PLN' },
    { id: 'exp_003', date: '2026-01-10', category: 'Gaji', description: 'Gaji karyawan produksi', amount: 15000000, paymentMethod: 'Transfer', status: 'pending', vendor: '-' },
    { id: 'exp_004', date: '2026-01-10', category: 'Maintenance', description: 'Servis Pellet Mill #3', amount: 500000, paymentMethod: 'Cash', status: 'paid', vendor: 'Internal' },
    { id: 'exp_005', date: '2026-01-09', category: 'Transport', description: 'Pengiriman ke PLN', amount: 2500000, paymentMethod: 'Transfer', status: 'paid', vendor: 'CV Ekspedisi Cepat' },
    { id: 'exp_006', date: '2026-01-08', category: 'Operasional', description: 'ATK dan supplies', amount: 350000, paymentMethod: 'Cash', status: 'paid', vendor: 'Toko ATK Maju' },
];

// HRD Module - Employees
export const mockEmployees = [
    { id: 'emp_001', name: 'Pak Ridwan', position: 'Operator Produksi', department: 'Produksi', age: 32, gender: 'Male', education: 'SMA', hireDate: '2023-03-15', tenure: 3, phone: '0812-3456-7890', email: 'ridwan@dayapadi.com', status: 'active', salary: 4500000 },
    { id: 'emp_002', name: 'Pak Eko', position: 'Teknisi', department: 'Maintenance', age: 35, gender: 'Male', education: 'D3', hireDate: '2021-06-01', tenure: 5, phone: '0813-4567-8901', email: 'eko@dayapadi.com', status: 'active', salary: 5500000 },
    { id: 'emp_003', name: 'Pak Budi', position: 'Operator Produksi', department: 'Produksi', age: 28, gender: 'Male', education: 'SMA', hireDate: '2024-01-10', tenure: 2, phone: '0814-5678-9012', email: 'budi@dayapadi.com', status: 'active', salary: 4000000 },
    { id: 'emp_004', name: 'Bu Sari', position: 'Admin', department: 'Admin', age: 30, gender: 'Female', education: 'S1', hireDate: '2022-02-20', tenure: 4, phone: '0815-6789-0123', email: 'sari@dayapadi.com', status: 'active', salary: 5000000 },
    { id: 'emp_005', name: 'Pak Yanto', position: 'Driver', department: 'Logistik', age: 40, gender: 'Male', education: 'SMA', hireDate: '2020-08-15', tenure: 6, phone: '0816-7890-1234', email: 'yanto@dayapadi.com', status: 'active', salary: 4200000 },
    { id: 'emp_006', name: 'Pak Dedi', position: 'Operator Produksi', department: 'Produksi', age: 25, gender: 'Male', education: 'SMA', hireDate: '2025-01-05', tenure: 1, phone: '0817-8901-2345', email: 'dedi@dayapadi.com', status: 'active', salary: 3800000 },
    { id: 'emp_007', name: 'Pak Agus', position: 'Security', department: 'Security', age: 45, gender: 'Male', education: 'SMA', hireDate: '2018-04-01', tenure: 8, phone: '0818-9012-3456', email: 'agus@dayapadi.com', status: 'active', salary: 3500000 },
    { id: 'emp_008', name: 'Pak Hendra', position: 'Staff Warehouse', department: 'Warehouse', age: 33, gender: 'Male', education: 'SMA', hireDate: '2022-07-10', tenure: 4, phone: '0819-0123-4567', email: 'hendra@dayapadi.com', status: 'active', salary: 4000000 },
];

// HRD Module - Attendance
export const mockAttendance = [
    { id: 'att_001', employeeId: 'emp_001', employeeName: 'Pak Ridwan', date: '2026-01-12', clockIn: '07:05', clockOut: '16:15', status: 'present', overtime: 1.25, notes: '' },
    { id: 'att_002', employeeId: 'emp_002', employeeName: 'Pak Eko', date: '2026-01-12', clockIn: '07:00', clockOut: '16:00', status: 'present', overtime: 0, notes: '' },
    { id: 'att_003', employeeId: 'emp_003', employeeName: 'Pak Budi', date: '2026-01-12', clockIn: '07:30', clockOut: '16:00', status: 'late', overtime: 0, notes: 'Terlambat 30 menit' },
    { id: 'att_004', employeeId: 'emp_004', employeeName: 'Bu Sari', date: '2026-01-12', clockIn: '08:00', clockOut: '17:00', status: 'present', overtime: 0, notes: '' },
    { id: 'att_005', employeeId: 'emp_005', employeeName: 'Pak Yanto', date: '2026-01-12', clockIn: null, clockOut: null, status: 'sick', overtime: 0, notes: 'Sakit dengan surat dokter' },
    { id: 'att_006', employeeId: 'emp_006', employeeName: 'Pak Dedi', date: '2026-01-12', clockIn: '07:02', clockOut: '16:30', status: 'present', overtime: 0.5, notes: '' },
    { id: 'att_007', employeeId: 'emp_007', employeeName: 'Pak Agus', date: '2026-01-12', clockIn: '06:00', clockOut: '18:00', status: 'present', overtime: 4, notes: 'Shift malam' },
    { id: 'att_008', employeeId: 'emp_008', employeeName: 'Pak Hendra', date: '2026-01-12', clockIn: null, clockOut: null, status: 'absent', overtime: 0, notes: 'Tidak hadir tanpa keterangan' },
];
