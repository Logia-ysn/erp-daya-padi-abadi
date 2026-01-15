import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Clock, Wrench, XCircle, Plus, Filter, Download, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, Input, Label } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useCrud, useModal, useConfirm } from '@/hooks/useCrud';
import { STORAGE_KEYS } from '@/services/api';
import { mockDowntime } from '@/services/mockDataModules';
import { mockWorksheets, mockMachines } from '@/services/mockData';
import { getDowntimeFromWorksheets } from '@/services/worksheetIntegration';
import { cn } from '@/lib/utils';

const DowntimePage = () => {
    const { t } = useTranslation();
    const { items: manualDowntimeRecords, isLoading, create, update, remove } = useCrud(STORAGE_KEYS.DOWNTIME, mockDowntime);
    const { items: worksheets } = useCrud('erp_worksheets', mockWorksheets);

    // Combine manual downtime and worksheet downtime
    const downtimeRecords = useMemo(() => {
        const worksheetDowntimes = getDowntimeFromWorksheets(worksheets);
        return [...manualDowntimeRecords, ...worksheetDowntimes];
    }, [manualDowntimeRecords, worksheets]);
    const modal = useModal();
    const confirmDialog = useConfirm();
    const [filterType, setFilterType] = useState('all');
    const [formData, setFormData] = useState({
        machine: '',
        type: 'Planned',
        reason: '',
        startTime: '',
        endTime: '',
        technician: '',
        notes: '',
        status: 'completed'
    });

    // Get machines from backend instead of hardcoded array
    const { items: machinesList } = useCrud('erp_machines', mockMachines);
    const machines = machinesList.map(m => m.name);

    // Calculate duration in hours
    const calculateDuration = (start, end) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.round((endDate - startDate) / (1000 * 60 * 60) * 10) / 10;
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            machine: '',
            type: 'Planned',
            reason: '',
            startTime: '',
            endTime: '',
            technician: '',
            notes: '',
            status: 'completed'
        });
    };

    // Handle form open for edit
    useEffect(() => {
        if (modal.selectedItem && modal.mode === 'edit') {
            setFormData({
                machine: modal.selectedItem.machine || '',
                type: modal.selectedItem.type || 'Planned',
                reason: modal.selectedItem.reason || '',
                startTime: modal.selectedItem.startTime || '',
                endTime: modal.selectedItem.endTime || '',
                technician: modal.selectedItem.technician || '',
                notes: modal.selectedItem.notes || '',
                status: modal.selectedItem.status || 'completed'
            });
        } else {
            resetForm();
        }
    }, [modal.selectedItem, modal.mode]);

    // Handle save
    const handleSave = async () => {
        const duration = calculateDuration(formData.startTime, formData.endTime);
        const data = { ...formData, duration };

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

    // Filter records
    const filteredRecords = filterType === 'all'
        ? downtimeRecords
        : downtimeRecords.filter(r => r.type?.toLowerCase() === filterType);

    // Calculate statistics
    const totalDowntime = downtimeRecords.reduce((sum, r) => sum + (r.duration || 0), 0);
    const plannedDowntime = downtimeRecords.filter(r => r.type === 'Planned').reduce((sum, r) => sum + (r.duration || 0), 0);
    const unplannedDowntime = downtimeRecords.filter(r => r.type === 'Unplanned').reduce((sum, r) => sum + (r.duration || 0), 0);

    const downtimeByType = [
        { name: 'Planned', value: plannedDowntime, color: '#3b82f6' },
        { name: 'Unplanned', value: unplannedDowntime, color: '#ef4444' },
    ].filter(d => d.value > 0);

    // Group by reason for bar chart
    const downtimeByReason = Object.entries(
        downtimeRecords.reduce((acc, r) => {
            acc[r.reason] = (acc[r.reason] || 0) + (r.duration || 0);
            return acc;
        }, {})
    ).map(([reason, hours]) => ({ reason, hours })).sort((a, b) => b.hours - a.hours).slice(0, 5);

    const summaryCards = [
        { label: 'Total Downtime', value: `${totalDowntime} jam`, subtext: 'Periode ini', icon: Clock, color: 'red' },
        { label: 'Planned Downtime', value: `${plannedDowntime} jam`, subtext: `${totalDowntime > 0 ? Math.round(plannedDowntime / totalDowntime * 100) : 0}%`, icon: Wrench, color: 'blue' },
        { label: 'Unplanned Downtime', value: `${unplannedDowntime} jam`, subtext: `${totalDowntime > 0 ? Math.round(unplannedDowntime / totalDowntime * 100) : 0}%`, icon: XCircle, color: 'red' },
        { label: 'Total Incident', value: downtimeRecords.length, subtext: 'Periode ini', icon: AlertTriangle, color: 'yellow' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Down Time</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Analisis dan pencatatan waktu henti produksi</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                    <Button onClick={modal.openCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Catat Downtime
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((stat, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">{stat.label}</p>
                                    <p className="text-xl font-bold">{stat.value}</p>
                                    <p className="text-xs text-[var(--color-text-secondary)]">{stat.subtext}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* By Type Pie */}
                <Card>
                    <CardHeader>
                        <CardTitle>Downtime by Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            {downtimeByType.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={downtimeByType} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label>
                                            {downtimeByType.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value} jam`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">Belum ada data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* By Reason Bar */}
                <Card>
                    <CardHeader>
                        <CardTitle>Downtime by Reason (Jam)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            {downtimeByReason.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={downtimeByReason} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis type="number" tick={{ fontSize: 12 }} />
                                        <YAxis dataKey="reason" type="category" tick={{ fontSize: 11 }} width={120} />
                                        <Tooltip />
                                        <Bar dataKey="hours" fill="#ef4444" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">Belum ada data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Downtime Records Table */}
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Riwayat Downtime</CardTitle>
                    <div className="flex gap-2">
                        {['all', 'planned', 'unplanned'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={cn(
                                    'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                                    filterType === type
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                )}
                            >
                                {type === 'all' ? 'Semua' : type === 'planned' ? 'Planned' : 'Unplanned'}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Mesin</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Type</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Alasan</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Mulai</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Selesai</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Durasi</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Teknisi</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium">{record.machineName || record.machine}</p>
                                                {record.source === 'worksheet' && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <FileText className="w-3 h-3 text-purple-600" />
                                                        <span className="text-xs text-purple-600">{record.worksheetNumber}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-1">
                                                <span className={cn(
                                                    'px-2 py-1 rounded-full text-xs font-medium',
                                                    record.type === 'Planned' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                                )}>
                                                    {record.type || 'Unplanned'}
                                                </span>
                                                {record.source === 'worksheet' && (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                                        Worksheet
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{record.description || record.reason}</td>
                                        <td className="py-3 px-4 text-sm">
                                            {record.startTime ? (
                                                record.source === 'worksheet'
                                                    ? `${record.date} ${record.startTime}`
                                                    : new Date(record.startTime).toLocaleString('id-ID')
                                            ) : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            {record.endTime ? (
                                                record.source === 'worksheet'
                                                    ? `${record.date} ${record.endTime}`
                                                    : new Date(record.endTime).toLocaleString('id-ID')
                                            ) : '-'}
                                        </td>
                                        <td className="py-3 px-4 font-medium">{record.duration} jam</td>
                                        <td className="py-3 px-4">{record.reportedBy || record.technician}</td>
                                        <td className="py-3 px-4">
                                            {record.source === 'worksheet' ? (
                                                <span className="text-xs text-[var(--color-text-secondary)] italic">
                                                    From worksheet
                                                </span>
                                            ) : (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => modal.openEdit(record)}
                                                        className="p-1.5 hover:bg-gray-100 rounded"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4 text-gray-500" />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDialog.openConfirm(record)}
                                                        className="p-1.5 hover:bg-red-50 rounded"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-gray-400">Belum ada data downtime</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Downtime Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => { modal.close(); resetForm(); }}
                title={modal.mode === 'edit' ? 'Edit Downtime' : 'Catat Downtime Baru'}
            >
                <div className="space-y-4">
                    <div>
                        <Label>Mesin *</Label>
                        <select
                            value={formData.machine}
                            onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        >
                            <option value="">Pilih Mesin</option>
                            {machines.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label>Type *</Label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        >
                            <option value="Planned">Planned</option>
                            <option value="Unplanned">Unplanned</option>
                        </select>
                    </div>
                    <div>
                        <Label>Alasan *</Label>
                        <Input
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            placeholder="Masukkan alasan downtime"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Waktu Mulai *</Label>
                            <Input
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Waktu Selesai *</Label>
                            <Input
                                type="datetime-local"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Teknisi</Label>
                        <Input
                            value={formData.technician}
                            onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                            placeholder="Nama teknisi"
                        />
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
                        <Button variant="outline" onClick={() => { modal.close(); resetForm(); }} className="flex-1">
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1"
                            disabled={!formData.machine || !formData.reason || !formData.startTime || !formData.endTime}
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
                        Apakah Anda yakin ingin menghapus data downtime untuk <strong>{confirmDialog.itemToDelete?.machine}</strong> ({confirmDialog.itemToDelete?.reason})?
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

export default DowntimePage;
