import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, Input, Label } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useCrud, useModal, useConfirm } from '@/hooks/useCrud';
import { STORAGE_KEYS } from '@/services/api';
import { mockStock } from '@/services/mockDataModules';
import { cn, formatCurrency } from '@/lib/utils';

const StockPage = () => {
    const { t } = useTranslation();
    const { items: stockItems, isLoading, create, update, remove } = useCrud(STORAGE_KEYS.STOCK, mockStock);
    const modal = useModal();
    const confirmDialog = useConfirm();
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        category: 'raw',
        stock: 0,
        minStock: 0,
        maxStock: 0,
        unit: 'kg',
        location: '',
        pricePerUnit: 0
    });

    const categories = [
        { value: 'all', label: 'Semua' },
        { value: 'raw', label: 'Bahan Baku' },
        { value: 'wip', label: 'WIP' },
        { value: 'finished', label: 'Barang Jadi' },
        { value: 'sparepart', label: 'Sparepart' },
    ];

    const units = ['kg', 'pcs', 'karung', 'liter', 'unit'];

    // Reset form
    const resetForm = () => {
        setFormData({
            code: '',
            name: '',
            category: 'raw',
            stock: 0,
            minStock: 0,
            maxStock: 0,
            unit: 'kg',
            location: '',
            pricePerUnit: 0
        });
    };

    // Handle form open for edit
    useEffect(() => {
        if (modal.selectedItem && modal.mode === 'edit') {
            setFormData({
                code: modal.selectedItem.code || '',
                name: modal.selectedItem.name || '',
                category: modal.selectedItem.category || 'raw',
                stock: modal.selectedItem.stock || 0,
                minStock: modal.selectedItem.minStock || 0,
                maxStock: modal.selectedItem.maxStock || 0,
                unit: modal.selectedItem.unit || 'kg',
                location: modal.selectedItem.location || '',
                pricePerUnit: modal.selectedItem.pricePerUnit || 0
            });
        } else {
            resetForm();
        }
    }, [modal.selectedItem, modal.mode]);

    // Handle save
    const handleSave = async () => {
        const data = {
            ...formData,
            stock: Number(formData.stock),
            minStock: Number(formData.minStock),
            maxStock: Number(formData.maxStock),
            pricePerUnit: Number(formData.pricePerUnit)
        };

        if (modal.mode === 'edit' && modal.selectedItem) {
            await update(modal.selectedItem.id, data);
        } else {
            await create(data);
        }
        modal.close();
        resetForm();
    };

    // Handle delete
    const handleDelete = async () => {
        if (confirmDialog.itemToDelete) {
            await remove(confirmDialog.itemToDelete.id);
            confirmDialog.close();
        }
    };

    // Filter and search items
    const filteredItems = useMemo(() => {
        return stockItems.filter(item => {
            const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
            const matchesSearch = !searchTerm ||
                item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.code?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [stockItems, filterCategory, searchTerm]);

    // Calculate statistics
    const totalSku = stockItems.length;
    const lowStockItems = stockItems.filter(i => i.stock <= i.minStock).length;
    const totalValue = stockItems.reduce((sum, i) => sum + (i.stock * i.pricePerUnit), 0);

    // Chart data
    const stockByCategory = useMemo(() => {
        const categoryColors = { raw: '#3b82f6', wip: '#f59e0b', finished: '#22c55e', sparepart: '#8b5cf6' };
        const categoryLabels = { raw: 'Bahan Baku', wip: 'WIP', finished: 'Barang Jadi', sparepart: 'Sparepart' };

        return Object.entries(
            stockItems.reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + 1;
                return acc;
            }, {})
        ).map(([category, count]) => ({
            name: categoryLabels[category] || category,
            value: count,
            color: categoryColors[category] || '#6b7280'
        }));
    }, [stockItems]);

    const summaryCards = [
        { label: 'Total SKU', value: totalSku, icon: Package, color: 'blue' },
        { label: 'Low Stock Alert', value: lowStockItems, icon: AlertTriangle, color: 'red' },
        { label: 'Total Nilai Stock', value: formatCurrency(totalValue), icon: ArrowUpRight, color: 'green', small: true },
    ];

    const getCategoryLabel = (cat) => {
        const found = categories.find(c => c.value === cat);
        return found ? found.label : cat;
    };

    const getStockStatus = (item) => {
        if (item.stock <= item.minStock) return { label: 'Low', class: 'bg-red-100 text-red-700' };
        if (item.stock >= item.maxStock * 0.9) return { label: 'Full', class: 'bg-green-100 text-green-700' };
        return { label: 'Normal', class: 'bg-blue-100 text-blue-700' };
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Manajemen Stok</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Monitoring dan pengelolaan inventori produksi</p>
                </div>
                <Button onClick={modal.openCreate} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Tambah Item
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summaryCards.map((card, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-${card.color}-100`}>
                                    <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">{card.label}</p>
                                    <p className={cn("font-bold", card.small ? "text-lg" : "text-2xl")}>{card.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribution Pie */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribusi Stok per Kategori</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            {stockByCategory.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={stockByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label>
                                            {stockByCategory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">Belum ada data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Low Stock Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Item Low Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stockItems.filter(i => i.stock <= i.minStock).length > 0 ? (
                                stockItems.filter(i => i.stock <= i.minStock).map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.code}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-red-600">{item.stock} {item.unit}</p>
                                            <p className="text-xs text-gray-400">Min: {item.minStock}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-gray-400">Semua stok dalam kondisi normal</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stock Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full flex-wrap gap-4">
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setFilterCategory(cat.value)}
                                    className={cn(
                                        'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                                        filterCategory === cat.value
                                            ? 'bg-[var(--color-primary)] text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    )}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari item..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Kode</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Nama Item</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Kategori</th>
                                    <th className="text-right py-3 px-4 font-medium text-[var(--color-text-secondary)]">Stok</th>
                                    <th className="text-right py-3 px-4 font-medium text-[var(--color-text-secondary)]">Min/Max</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Lokasi</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length > 0 ? filteredItems.map((item) => {
                                    const status = getStockStatus(item);
                                    return (
                                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 font-mono text-sm">{item.code}</td>
                                            <td className="py-3 px-4 font-medium">{item.name}</td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">{getCategoryLabel(item.category)}</span>
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold">{item.stock.toLocaleString()} {item.unit}</td>
                                            <td className="py-3 px-4 text-right text-sm text-gray-500">{item.minStock} / {item.maxStock}</td>
                                            <td className="py-3 px-4 text-sm">{item.location}</td>
                                            <td className="py-3 px-4">
                                                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', status.class)}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => modal.openEdit(item)}
                                                        className="p-1.5 hover:bg-gray-100 rounded"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4 text-gray-500" />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDialog.openConfirm(item)}
                                                        className="p-1.5 hover:bg-red-50 rounded"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-gray-400">Tidak ada data</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => { modal.close(); resetForm(); }}
                title={modal.mode === 'edit' ? 'Edit Item Stok' : 'Tambah Item Stok'}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Kode *</Label>
                            <Input
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="RM-001"
                            />
                        </div>
                        <div>
                            <Label>Kategori *</Label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            >
                                {categories.filter(c => c.value !== 'all').map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <Label>Nama Item *</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nama item"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Stok Saat Ini</Label>
                            <Input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Min Stock</Label>
                            <Input
                                type="number"
                                value={formData.minStock}
                                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Max Stock</Label>
                            <Input
                                type="number"
                                value={formData.maxStock}
                                onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Unit</Label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            >
                                {units.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label>Lokasi</Label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Gudang A"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Harga per Unit (Rp)</Label>
                        <Input
                            type="number"
                            value={formData.pricePerUnit}
                            onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => { modal.close(); resetForm(); }} className="flex-1">
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1"
                            disabled={!formData.code || !formData.name}
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={confirmDialog.isOpen}
                onClose={confirmDialog.close}
                title="Konfirmasi Hapus"
            >
                <div className="space-y-4">
                    <p className="text-[var(--color-text-secondary)]">
                        Apakah Anda yakin ingin menghapus item <strong>{confirmDialog.itemToDelete?.name}</strong> ({confirmDialog.itemToDelete?.code})?
                    </p>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={confirmDialog.close} className="flex-1">
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} className="flex-1">
                            {isLoading ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StockPage;
