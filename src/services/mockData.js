/**
 * Mock data for initial seeding
 * Data separated by factory for multi-factory support
 */

export const mockSuppliers = [
    // Factory Subang
    { id: 'sup_001', code: 'SUP-001', name: 'Penggilingan Padi Makmur', address: 'Jl. Raya Karawang No. 123, Karawang', contact: 'Pak Udin', phone: '0812-3456-7890', rating: 4.5, status: 'active', factoryId: 'factory_subang' },
    { id: 'sup_002', code: 'SUP-002', name: 'UD Padi Jaya', address: 'Jl. Raya Subang No. 45, Subang', contact: 'Bu Ani', phone: '0813-4567-8901', rating: 4.2, status: 'active', factoryId: 'factory_subang' },
    // Factory Indramayu
    { id: 'sup_101', code: 'IDM-SUP-001', name: 'CV Sekam Sejahtera', address: 'Jl. Pantura Km. 12, Indramayu', contact: 'Pak Budi', phone: '0856-7890-1234', rating: 3.8, status: 'active', factoryId: 'factory_indramayu' },
    { id: 'sup_102', code: 'IDM-SUP-002', name: 'Koperasi Tani Maju', address: 'Jl. Pertanian No. 88, Cirebon', contact: 'Pak Slamet', phone: '0878-9012-3456', rating: 4.0, status: 'active', factoryId: 'factory_indramayu' },
];

export const mockCustomers = [
    // Factory Subang
    { id: 'cust_001', code: 'CUST-001', name: 'PT PLN Pembangkitan Jawa-Bali', type: 'pltu', address: 'Jl. Trunojoyo Blok M I/135, Kebayoran Baru, Jakarta', contact: 'Ir. Bambang Sutrisno', phone: '021-725-1234', paymentTerms: 30, status: 'active', factoryId: 'factory_subang' },
    { id: 'cust_002', code: 'CUST-002', name: 'CV Pabrik Tahu Murni', type: 'industry', address: 'Jl. Industri No. 55, Bandung', contact: 'Pak Herman', phone: '022-731-5678', paymentTerms: 14, status: 'active', factoryId: 'factory_subang' },
    // Factory Indramayu
    { id: 'cust_101', code: 'IDM-CUST-001', name: 'PT Semen Indonesia', type: 'industry', address: 'Jl. Veteran, Gresik, Jawa Timur', contact: 'Andi Prasetyo', phone: '031-398-1234', paymentTerms: 45, status: 'active', factoryId: 'factory_indramayu' },
    { id: 'cust_102', code: 'IDM-CUST-002', name: 'Toko Biomassa Jaya Indramayu', type: 'end_customer', address: 'Jl. Raya Indramayu Km. 15', contact: 'Bu Siti', phone: '0817-1234-5678', paymentTerms: 0, status: 'active', factoryId: 'factory_indramayu' },
];

export const mockInventory = [
    // Factory Subang
    { id: 'inv_001', code: 'RM-001', name: 'Sekam Padi Basah', type: 'raw', category: 'Bahan Baku', unit: 'kg', currentStock: 15000, minStock: 5000, maxStock: 50000, location: 'Gudang A', moistureContent: 25, pricePerUnit: 800, factoryId: 'factory_subang' },
    { id: 'inv_002', code: 'RM-002', name: 'Sekam Padi Kering', type: 'raw', category: 'Bahan Baku', unit: 'kg', currentStock: 8500, minStock: 3000, maxStock: 30000, location: 'Gudang A', moistureContent: 12, pricePerUnit: 1200, factoryId: 'factory_subang' },
    { id: 'inv_003', code: 'FG-001', name: 'Pellet Karung 30kg', type: 'finished', category: 'Barang Jadi', unit: 'karung', currentStock: 450, minStock: 100, maxStock: 2000, location: 'Gudang B', pricePerUnit: 75000, factoryId: 'factory_subang' },
    { id: 'inv_004', code: 'SP-001', name: 'Dies 8mm', type: 'sparepart', category: 'Spareparts', unit: 'pcs', currentStock: 3, minStock: 2, maxStock: 10, location: 'Gudang C', pricePerUnit: 15000000, factoryId: 'factory_subang' },
    // Factory Indramayu
    { id: 'inv_101', code: 'IDM-RM-001', name: 'Sekam Padi Basah Indramayu', type: 'raw', category: 'Bahan Baku', unit: 'kg', currentStock: 25000, minStock: 8000, maxStock: 80000, location: 'Gudang Utama', moistureContent: 23, pricePerUnit: 750, factoryId: 'factory_indramayu' },
    { id: 'inv_102', code: 'IDM-FG-001', name: 'Pellet Jumbo Bag 1 ton', type: 'finished', category: 'Barang Jadi', unit: 'jumbobag', currentStock: 45, minStock: 10, maxStock: 200, location: 'Area Loading', pricePerUnit: 2200000, factoryId: 'factory_indramayu' },
    { id: 'inv_103', code: 'IDM-SP-001', name: 'Roller Assembly', type: 'sparepart', category: 'Spareparts', unit: 'pcs', currentStock: 4, minStock: 2, maxStock: 8, location: 'Gudang Sparepart', pricePerUnit: 8500000, factoryId: 'factory_indramayu' },
];

export const mockMachines = [
    // Factory Subang
    { id: 'mch_001', code: 'MCH-001', name: 'Pellet Mill #1', category: 'production', model: 'ZLSP-300B', runningHours: 2450, maxHours: 3000, lastMaintenance: '2025-12-15', nextMaintenance: '2026-01-15', status: 'running', operator: 'Pak Joko', factoryId: 'factory_subang' },
    { id: 'mch_002', code: 'MCH-002', name: 'Pellet Mill #2', category: 'production', model: 'ZLSP-300B', runningHours: 1890, maxHours: 3000, lastMaintenance: '2025-12-20', nextMaintenance: '2026-01-20', status: 'running', operator: 'Pak Dedi', factoryId: 'factory_subang' },
    { id: 'mch_003', code: 'MCH-003', name: 'Dryer Unit', category: 'supporting', model: 'RD-500', runningHours: 1250, maxHours: 5000, lastMaintenance: '2025-12-01', nextMaintenance: '2026-03-01', status: 'running', operator: 'Pak Budi', factoryId: 'factory_subang' },
    // Factory Indramayu
    { id: 'mch_101', code: 'IDM-001', name: 'Pellet Mill Indramayu #1', category: 'production', model: 'ZLSP-400B', runningHours: 980, maxHours: 3000, lastMaintenance: '2025-12-10', nextMaintenance: '2026-02-10', status: 'running', operator: 'Pak Ahmad', factoryId: 'factory_indramayu' },
    { id: 'mch_102', code: 'IDM-002', name: 'Pellet Mill Indramayu #2', category: 'production', model: 'ZLSP-400B', runningHours: 750, maxHours: 3000, lastMaintenance: '2025-12-15', nextMaintenance: '2026-02-15', status: 'idle', operator: 'Pak Rahmat', factoryId: 'factory_indramayu' },
    { id: 'mch_103', code: 'IDM-003', name: 'Hammer Mill Indramayu', category: 'supporting', model: 'HM-420', runningHours: 450, maxHours: 4000, lastMaintenance: '2025-12-20', nextMaintenance: '2026-03-20', status: 'running', operator: 'Pak Yusuf', factoryId: 'factory_indramayu' },
];

export const mockPurchaseOrders = [
    // Factory Subang
    { id: 'po_001', poNumber: 'PO-SUB-001', supplierId: 'sup_001', supplierName: 'Penggilingan Padi Makmur', date: '2026-01-05', deliveryDate: '2026-01-08', items: [{ material: 'Sekam Padi Basah', qty: 5000, unit: 'kg', moistureContent: 22, pricePerKg: 850 }], totalAmount: 4250000, status: 'completed', factoryId: 'factory_subang' },
    { id: 'po_002', poNumber: 'PO-SUB-002', supplierId: 'sup_002', supplierName: 'UD Padi Jaya', date: '2026-01-08', deliveryDate: '2026-01-12', items: [{ material: 'Sekam Padi Basah', qty: 8000, unit: 'kg', moistureContent: 25, pricePerKg: 800 }], totalAmount: 6400000, status: 'in_transit', factoryId: 'factory_subang' },
    // Factory Indramayu
    { id: 'po_101', poNumber: 'PO-IDM-001', supplierId: 'sup_101', supplierName: 'CV Sekam Sejahtera', date: '2026-01-10', deliveryDate: '2026-01-15', items: [{ material: 'Sekam Padi Kering', qty: 10000, unit: 'kg', moistureContent: 12, pricePerKg: 1200 }], totalAmount: 12000000, status: 'pending', factoryId: 'factory_indramayu' },
];

export const mockSalesOrders = [
    // Factory Subang
    { id: 'so_001', soNumber: 'SO-SUB-001', customerId: 'cust_001', customerName: 'PT PLN Pembangkitan Jawa-Bali', type: 'contract', date: '2026-01-02', deliveryDate: '2026-01-15', items: [{ product: 'Pellet Karung 30kg', qty: 200, unit: 'karung', pricePerUnit: 75000 }], totalAmount: 15000000, status: 'in_progress', factoryId: 'factory_subang' },
    { id: 'so_002', soNumber: 'SO-SUB-002', customerId: 'cust_002', customerName: 'CV Pabrik Tahu Murni', type: 'spot', date: '2026-01-10', deliveryDate: '2026-01-10', items: [{ product: 'Pellet Karung 30kg', qty: 50, unit: 'karung', pricePerUnit: 75000 }], totalAmount: 3750000, status: 'completed', factoryId: 'factory_subang' },
    // Factory Indramayu
    { id: 'so_101', soNumber: 'SO-IDM-001', customerId: 'cust_101', customerName: 'PT Semen Indonesia', type: 'contract', date: '2026-01-05', deliveryDate: '2026-01-20', items: [{ product: 'Pellet Jumbo Bag 1 ton', qty: 30, unit: 'jumbobag', pricePerUnit: 2150000 }], totalAmount: 64500000, status: 'pending', factoryId: 'factory_indramayu' },
];

export const mockProduction = [
    { id: 'prod_001', woNumber: 'WO-2026-001', batchNo: 'BATCH-001', date: '2026-01-08', machineId: 'mch_001', machineName: 'Pellet Mill #1', inputMaterial: 'Sekam Padi Kering', inputQty: 5000, outputQty: 4850, yieldRate: 97, operator: 'Pak Joko', shift: '1', status: 'completed' },
    { id: 'prod_002', woNumber: 'WO-2026-002', batchNo: 'BATCH-002', date: '2026-01-09', machineId: 'mch_002', machineName: 'Pellet Mill #2', inputMaterial: 'Sekam Padi Kering', inputQty: 6000, outputQty: 5820, yieldRate: 97, operator: 'Pak Dedi', shift: '1', status: 'completed' },
    { id: 'prod_003', woNumber: 'WO-2026-003', batchNo: 'BATCH-003', date: '2026-01-10', machineId: 'mch_001', machineName: 'Pellet Mill #1', inputMaterial: 'Sekam Padi Kering', inputQty: 4500, outputQty: 0, yieldRate: 0, operator: 'Pak Joko', shift: '2', status: 'in_progress' },
];

export const mockWorksheets = [
    // Factory Subang
    {
        id: 'ws_001',
        worksheetNumber: 'WS-SUB-001',
        productionDate: '2026-01-08',
        shift: '1',
        shiftLead: 'Pak Joko',
        operatorCount: 3,
        workStartTime: '06:00',
        breakTime: '12:00',
        breakEndTime: '13:00',
        workEndTime: '14:00',
        machineId: 'mch_001',
        machineName: 'Pellet Mill #1',
        targetProduction: 5000,
        actualProduction: 4850,
        bagCount: 162,
        packagingType: 'karung',
        qualityRate: 95,
        downtimes: [
            { id: 1, startTime: '09:30', endTime: '10:00', type: 'corrective', category: 'mechanical', description: 'Belt adjustment needed' }
        ],
        status: 'completed',
        factoryId: 'factory_subang'
    },
    {
        id: 'ws_002',
        worksheetNumber: 'WS-SUB-002',
        productionDate: '2026-01-09',
        shift: '1',
        shiftLead: 'Pak Dedi',
        operatorCount: 3,
        workStartTime: '06:00',
        breakTime: '12:00',
        breakEndTime: '13:00',
        workEndTime: '14:00',
        machineId: 'mch_002',
        machineName: 'Pellet Mill #2',
        targetProduction: 6000,
        actualProduction: 5820,
        bagCount: 194,
        packagingType: 'karung',
        qualityRate: 98,
        downtimes: [],
        status: 'completed',
        factoryId: 'factory_subang'
    },
    // Factory Indramayu
    {
        id: 'ws_101',
        worksheetNumber: 'WS-IDM-001',
        productionDate: '2026-01-08',
        shift: '1',
        shiftLead: 'Pak Ahmad',
        operatorCount: 4,
        workStartTime: '06:00',
        breakTime: '12:00',
        breakEndTime: '13:00',
        workEndTime: '14:00',
        machineId: 'mch_101',
        machineName: 'Pellet Mill Indramayu #1',
        targetProduction: 7000,
        actualProduction: 6800,
        bagCount: 8,
        packagingType: 'jumbobag',
        qualityRate: 97,
        downtimes: [],
        status: 'completed',
        factoryId: 'factory_indramayu'
    },
    {
        id: 'ws_102',
        worksheetNumber: 'WS-IDM-002',
        productionDate: '2026-01-10',
        shift: '2',
        shiftLead: 'Pak Rahmat',
        operatorCount: 3,
        workStartTime: '14:00',
        breakTime: '18:00',
        breakEndTime: '19:00',
        workEndTime: '22:00',
        machineId: 'mch_102',
        machineName: 'Pellet Mill Indramayu #2',
        targetProduction: 5500,
        actualProduction: 3200,
        bagCount: 4,
        packagingType: 'jumbobag',
        qualityRate: 92,
        downtimes: [
            { id: 1, startTime: '16:00', endTime: '17:30', type: 'planned', category: 'setup', description: 'Setup changeover produk baru' }
        ],
        status: 'in_progress',
        factoryId: 'factory_indramayu'
    },
];

export const mockMaintenance = [
    // Factory Subang
    { id: 'mnt_001', machineId: 'mch_001', machineName: 'Pellet Mill #1', type: 'preventive', date: '2025-12-15', description: 'Servis rutin', partsUsed: [], laborHours: 2, downtime: 3, technician: 'Pak Ridwan', cost: 500000, status: 'completed', factoryId: 'factory_subang' },
    { id: 'mnt_002', machineId: 'mch_002', machineName: 'Pellet Mill #2', type: 'corrective', date: '2025-12-20', description: 'Perbaikan roller aus', partsUsed: [{ part: 'Roller Assembly', qty: 1 }], laborHours: 6, downtime: 12, technician: 'Pak Eko', cost: 9200000, status: 'completed', factoryId: 'factory_subang' },
    // Factory Indramayu
    { id: 'mnt_101', machineId: 'mch_101', machineName: 'Pellet Mill Indramayu #1', type: 'preventive', date: '2026-01-05', description: 'Penggantian Dies', partsUsed: [{ part: 'Dies 8mm', qty: 1 }], laborHours: 4, downtime: 8, technician: 'Pak Dodo', cost: 15500000, status: 'completed', factoryId: 'factory_indramayu' },
];

// Dashboard metrics
export const mockDashboardMetrics = {
    totalRevenue: 177000000,
    totalRevenueChange: 12.5,
    totalProduction: 14170, // kg
    totalProductionChange: 8.3,
    activeOrders: 4,
    activeOrdersChange: -2,
    machineUptime: 87.5,
    machineUptimeChange: 3.2,
};

export const mockProductionChart = [
    { date: '01 Jan', output: 4200 },
    { date: '02 Jan', output: 3800 },
    { date: '03 Jan', output: 4500 },
    { date: '04 Jan', output: 4100 },
    { date: '05 Jan', output: 3900 },
    { date: '06 Jan', output: 0 },
    { date: '07 Jan', output: 0 },
    { date: '08 Jan', output: 4850 },
    { date: '09 Jan', output: 5820 },
    { date: '10 Jan', output: 2100 },
    { date: '11 Jan', output: 4600 },
    { date: '12 Jan', output: 4300 },
];

export const mockSalesChart = [
    { month: 'Jul', revenue: 145000000 },
    { month: 'Aug', revenue: 158000000 },
    { month: 'Sep', revenue: 142000000 },
    { month: 'Oct', revenue: 168000000 },
    { month: 'Nov', revenue: 175000000 },
    { month: 'Dec', revenue: 182000000 },
    { month: 'Jan', revenue: 177000000 },
];
