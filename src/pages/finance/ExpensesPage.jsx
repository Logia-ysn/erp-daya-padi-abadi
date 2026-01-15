import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, Plus, Calendar, Search, Filter, Download, TrendingDown, DollarSign, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, Input, Label } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useCrud, useModal, useConfirm } from '@/hooks/useCrud';
import { STORAGE_KEYS } from '@/services/api';
import { mockExpenses } from '@/services/mockDataModules';
import { cn, formatCurrency } from '@/lib/utils';

const ExpensesPage = () => {
    const { t } = useTranslation();
    const { items: expenses, isLoading, create, update, remove } = useCrud(STORAGE_KEYS.EXPENSES, mockExpenses);
    const modal = useModal();
    const confirmDialog = useConfirm();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: 'Operasional',
        description: '',
        amount: 0,
        paymentMethod: 'Transfer',
        status: 'paid',
        vendor: ''
    });

    const categories = ['all', 'Bahan Baku', 'Gaji', 'Listrik', 'Transport', 'Maintenance', 'Operasional'];

    // Reset form
    const resetForm = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            category: 'Operasional',
            description: '',
            amount: 0,
            paymentMethod: 'Transfer',
            status: 'paid',
            vendor: ''
        });
    };

    // Handle form open for edit
    useEffect(() => {
        if (modal.selectedItem && modal.mode === 'edit') {
            setFormData({
                date: modal.selectedItem.date || new Date().toISOString().split('T')[0],
                category: modal.selectedItem.category || 'Operasional',
                description: modal.selectedItem.description || '',
                amount: modal.selectedItem.amount || 0,
                paymentMethod: modal.selectedItem.paymentMethod || 'Transfer',
                status: modal.selectedItem.status || 'paid',
                vendor: modal.selectedItem.vendor || ''
            });
        } else {
            resetForm();
        }
    }, [modal.selectedItem, modal.mode]);

    // Handle save
    const handleSave = async () => {
        const data = {
            ...formData,
            amount: Number(formData.amount)
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

    // Filter expenses
    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            const matchesCategory = activeCategory === 'all' || expense.category === activeCategory;
            const matchesSearch = !searchTerm ||
                expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expense.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [expenses, activeCategory, searchTerm]);

    // Calculate statistics
    const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const avgDaily = expenses.length > 0 ? Math.round(totalExpense / new Set(expenses.map(e => e.date)).size) : 0;

    // Chart data
    const expenseByCategory = useMemo(() => {
        const colors = {
            'Bahan Baku': '#3b82f6',
            'Gaji': '#22c55e',
            'Listrik': '#f59e0b',
            'Transport': '#8b5cf6',
            'Maintenance': '#ef4444',
            'Operasional': '#06b6d4'
        };
        return Object.entries(
            expenses.reduce((acc, e) => {
                acc[e.category] = (acc[e.category] || 0) + (e.amount || 0);
                return acc;
            }, {})
        ).map(([name, value]) => ({
            name,
            value,
            color: colors[name] || '#6b7280'
        }));
    }, [expenses]);

    const dailyExpense = useMemo(() => {
        const byDate = expenses.reduce((acc, e) => {
            const date = e.date;
            acc[date] = (acc[date] || 0) + (e.amount || 0);
            return acc;
        }, {});
        return Object.entries(byDate)
            .map(([date, amount]) => ({ date: new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }), amount }))
            .slice(-7);
    }, [expenses]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Pengeluaran Harian</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Catat dan monitor pengeluaran harian</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                    <Button onClick={modal.openCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Catat Pengeluaran
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/20">
                                <TrendingDown className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-white/80">Total Pengeluaran</p>
                                <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
                                <p className="text-xs text-white/60">Periode ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-100">
                                <Wallet className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Rata-rata Harian</p>
                                <p className="text-2xl font-bold">{formatCurrency(avgDaily)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-100">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Transaksi</p>
                                <p className="text-2xl font-bold">{expenses.length}</p>
                                <p className="text-xs text-gray-400">Total entries</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tren Pengeluaran Harian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            {dailyExpense.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyExpense}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000000}jt`} />
                                        <Tooltip formatter={(v) => formatCurrency(v)} />
                                        <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} name="Pengeluaran" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">Belum ada data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* By Category */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pengeluaran per Kategori</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            {expenseByCategory.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" label>
                                            {expenseByCategory.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v) => formatCurrency(v)} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">Belum ada data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Expense Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full flex-wrap gap-4">
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                                        activeCategory === cat ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
                                    )}
                                >
                                    {cat === 'all' ? 'Semua' : cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari..."
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
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Tanggal</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Kategori</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Deskripsi</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Jumlah</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Metode</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses.length > 0 ? filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm">{expense.date}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{expense.category}</span>
                                        </td>
                                        <td className="py-3 px-4">{expense.description}</td>
                                        <td className="py-3 px-4 font-medium text-red-600">{formatCurrency(expense.amount)}</td>
                                        <td className="py-3 px-4 text-sm">{expense.paymentMethod}</td>
                                        <td className="py-3 px-4">
                                            <span className={cn(
                                                'px-2 py-1 rounded-full text-xs font-medium',
                                                expense.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            )}>
                                                {expense.status === 'paid' ? 'Lunas' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => modal.openEdit(expense)}
                                                    className="p-1.5 hover:bg-gray-100 rounded"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDialog.openConfirm(expense)}
                                                    className="p-1.5 hover:bg-red-50 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-gray-400">Tidak ada data pengeluaran</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Expense Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => { modal.close(); resetForm(); }}
                title={modal.mode === 'edit' ? 'Edit Pengeluaran' : 'Catat Pengeluaran'}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Tanggal *</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Kategori *</Label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            >
                                {categories.filter(c => c !== 'all').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <Label>Deskripsi *</Label>
                        <Input
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Deskripsi pengeluaran"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Jumlah (Rp) *</Label>
                            <Input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Metode Pembayaran</Label>
                            <select
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            >
                                <option value="Transfer">Transfer</option>
                                <option value="Cash">Cash</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Vendor / Penerima</Label>
                            <Input
                                value={formData.vendor}
                                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                placeholder="Nama vendor"
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            >
                                <option value="paid">Lunas</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => { modal.close(); resetForm(); }} className="flex-1">
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1"
                            disabled={!formData.date || !formData.description || !formData.amount}
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
                        Apakah Anda yakin ingin menghapus pengeluaran <strong>{confirmDialog.itemToDelete?.description}</strong>?
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

export default ExpensesPage;
