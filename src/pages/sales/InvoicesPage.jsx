import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Clock, CheckCircle, AlertTriangle, Plus, Search, Download, Mail, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, Input, Label } from '@/components/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useCrud, useModal, useConfirm } from '@/hooks/useCrud';
import { STORAGE_KEYS } from '@/services/api';
import { mockInvoices } from '@/services/mockDataModules';
import { cn, formatCurrency } from '@/lib/utils';

const InvoicesPage = () => {
    const { t } = useTranslation();
    const { items: invoices, isLoading, create, update, remove } = useCrud(STORAGE_KEYS.INVOICES, mockInvoices);
    const modal = useModal();
    const confirmDialog = useConfirm();
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        number: '',
        customerName: '',
        date: '',
        dueDate: '',
        amount: 0,
        status: 'pending',
        soNumber: '',
        notes: ''
    });

    // Generate invoice number
    const generateInvoiceNumber = () => {
        const year = new Date().getFullYear();
        const count = invoices.filter(i => i.number?.includes(String(year))).length + 1;
        return `INV-${year}-${String(count).padStart(3, '0')}`;
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            number: generateInvoiceNumber(),
            customerName: '',
            date: new Date().toISOString().split('T')[0],
            dueDate: '',
            amount: 0,
            status: 'pending',
            soNumber: '',
            notes: ''
        });
    };

    // Handle form open for edit
    useEffect(() => {
        if (modal.selectedItem && modal.mode === 'edit') {
            setFormData({
                number: modal.selectedItem.number || '',
                customerName: modal.selectedItem.customerName || '',
                date: modal.selectedItem.date || '',
                dueDate: modal.selectedItem.dueDate || '',
                amount: modal.selectedItem.amount || 0,
                status: modal.selectedItem.status || 'pending',
                soNumber: modal.selectedItem.soNumber || '',
                notes: modal.selectedItem.notes || ''
            });
        } else if (modal.isOpen && modal.mode === 'create') {
            resetForm();
        }
    }, [modal.selectedItem, modal.mode, modal.isOpen]);

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
    };

    // Handle delete
    const handleDelete = async () => {
        if (confirmDialog.itemToDelete) {
            await remove(confirmDialog.itemToDelete.id);
            confirmDialog.close();
        }
    };

    // Handle mark as paid
    const handleMarkAsPaid = async (invoice) => {
        await update(invoice.id, { status: 'paid' });
    };

    // Filter invoices
    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const matchesTab = activeTab === 'all' || inv.status === activeTab;
            const matchesSearch = !searchTerm ||
                inv.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [invoices, activeTab, searchTerm]);

    // Calculate statistics
    const totalOutstanding = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + (i.amount || 0), 0);
    const pendingCount = invoices.filter(i => i.status === 'pending').length;
    const paidCount = invoices.filter(i => i.status === 'paid').length;
    const overdueCount = invoices.filter(i => i.status === 'overdue').length;

    const statusData = [
        { name: 'Paid', value: paidCount, color: '#22c55e' },
        { name: 'Pending', value: pendingCount, color: '#f59e0b' },
        { name: 'Overdue', value: overdueCount, color: '#ef4444' },
    ].filter(d => d.value > 0);

    const summaryCards = [
        { label: 'Total Outstanding', value: formatCurrency(totalOutstanding), icon: FileText, color: 'blue' },
        { label: 'Pending', value: `${pendingCount} Invoice`, icon: Clock, color: 'yellow' },
        { label: 'Paid', value: `${paidCount} Invoice`, icon: CheckCircle, color: 'green' },
        { label: 'Overdue', value: `${overdueCount} Invoice`, icon: AlertTriangle, color: 'red' },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            paid: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            overdue: 'bg-red-100 text-red-700',
        };
        const labels = { paid: 'Lunas', pending: 'Pending', overdue: 'Overdue' };
        return <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[status])}>{labels[status]}</span>;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Invoice Tracker</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Kelola dan lacak status invoice</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                    <Button onClick={modal.openCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Buat Invoice
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-${card.color}-100`}>
                                    <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">{card.label}</p>
                                    <p className="text-xl font-bold">{card.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart and Table */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Status Pie */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status Invoice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-48">
                            {statusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                                            {statusData.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
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

                {/* Invoice Table */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <div className="flex items-center justify-between w-full flex-wrap gap-4">
                            <div className="flex gap-2">
                                {[
                                    { key: 'all', label: 'Semua' },
                                    { key: 'pending', label: 'Pending' },
                                    { key: 'paid', label: 'Lunas' },
                                    { key: 'overdue', label: 'Overdue' },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={cn(
                                            'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                                            activeTab === tab.key ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari invoice..."
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
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">No. Invoice</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Customer</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Tanggal</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Jatuh Tempo</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Jumlah</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInvoices.length > 0 ? filteredInvoices.map((invoice) => (
                                        <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 font-mono text-sm font-medium">{invoice.number}</td>
                                            <td className="py-3 px-4">{invoice.customerName}</td>
                                            <td className="py-3 px-4 text-sm">{invoice.date}</td>
                                            <td className="py-3 px-4 text-sm">{invoice.dueDate}</td>
                                            <td className="py-3 px-4 font-medium">{formatCurrency(invoice.amount)}</td>
                                            <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-1">
                                                    {invoice.status !== 'paid' && (
                                                        <button
                                                            onClick={() => handleMarkAsPaid(invoice)}
                                                            className="p-1.5 hover:bg-green-50 rounded"
                                                            title="Mark as Paid"
                                                        >
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => modal.openEdit(invoice)}
                                                        className="p-1.5 hover:bg-gray-100 rounded"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4 text-gray-500" />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDialog.openConfirm(invoice)}
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
                                            <td colSpan={7} className="py-8 text-center text-gray-400">Tidak ada data invoice</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Create/Edit Invoice Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={modal.close}
                title={modal.mode === 'edit' ? 'Edit Invoice' : 'Buat Invoice Baru'}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>No. Invoice *</Label>
                            <Input
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                placeholder="INV-2026-001"
                            />
                        </div>
                        <div>
                            <Label>No. SO</Label>
                            <Input
                                value={formData.soNumber}
                                onChange={(e) => setFormData({ ...formData, soNumber: e.target.value })}
                                placeholder="SO-2026-001"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Customer *</Label>
                        <Input
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            placeholder="Nama customer"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Tanggal Invoice</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Jatuh Tempo</Label>
                            <Input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
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
                            <Label>Status</Label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            >
                                <option value="pending">Pending</option>
                                <option value="paid">Lunas</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <Label>Catatan</Label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            rows={2}
                            placeholder="Catatan tambahan..."
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={modal.close} className="flex-1">Batal</Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1"
                            disabled={!formData.number || !formData.customerName || !formData.amount}
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
                        Apakah Anda yakin ingin menghapus invoice <strong>{confirmDialog.itemToDelete?.number}</strong>?
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

export default InvoicesPage;
