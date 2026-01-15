import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Wrench, Calendar, Clock, AlertTriangle, CheckCircle, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, Input, Label } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useCrud, useModal, useConfirm } from '@/hooks/useCrud';
import { STORAGE_KEYS } from '@/services/api';
import { mockMaintenanceSchedule } from '@/services/mockDataModules';
import { mockMachines } from '@/services/mockData';
import { cn, formatCurrency } from '@/lib/utils';

const MaintenanceProductionPage = () => {
    const { t } = useTranslation();
    const { items: schedules, isLoading, create, update, remove } = useCrud(STORAGE_KEYS.MAINTENANCE_SCHEDULE, mockMaintenanceSchedule);
    const modal = useModal();
    const confirmDialog = useConfirm();
    const [activeTab, setActiveTab] = useState('schedule');
    const [formData, setFormData] = useState({
        machine: '',
        type: 'Preventive',
        task: '',
        scheduledDate: '',
        status: 'upcoming',
        technician: '',
        estimatedDuration: 2,
        notes: ''
    });

    // Get machines from backend instead of hardcoded array
    const { items: machinesList } = useCrud('erp_machines', mockMachines);
    const machines = machinesList.map(m => m.name);

    // Reset form
    const resetForm = () => {
        setFormData({
            machine: '',
            type: 'Preventive',
            task: '',
            scheduledDate: '',
            status: 'upcoming',
            technician: '',
            estimatedDuration: 2,
            notes: ''
        });
    };

    // Handle form open for edit
    useEffect(() => {
        if (modal.selectedItem && modal.mode === 'edit') {
            setFormData({
                machine: modal.selectedItem.machine || '',
                type: modal.selectedItem.type || 'Preventive',
                task: modal.selectedItem.task || '',
                scheduledDate: modal.selectedItem.scheduledDate || '',
                status: modal.selectedItem.status || 'upcoming',
                technician: modal.selectedItem.technician || '',
                estimatedDuration: modal.selectedItem.estimatedDuration || 2,
                notes: modal.selectedItem.notes || ''
            });
        } else {
            resetForm();
        }
    }, [modal.selectedItem, modal.mode]);

    // Handle save
    const handleSave = async () => {
        const data = {
            ...formData,
            estimatedDuration: Number(formData.estimatedDuration)
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

    // Handle status update
    const handleStatusUpdate = async (schedule, newStatus) => {
        await update(schedule.id, { status: newStatus });
    };

    // Separate schedules and history
    const upcomingSchedules = schedules.filter(s => ['upcoming', 'in_progress'].includes(s.status));
    const historySchedules = schedules.filter(s => s.status === 'completed');

    // Calculate statistics
    const scheduledThisMonth = schedules.filter(s => s.status === 'upcoming').length;
    const inProgress = schedules.filter(s => s.status === 'in_progress').length;
    const completedThisMonth = schedules.filter(s => s.status === 'completed').length;
    const overdue = schedules.filter(s => s.status === 'upcoming' && new Date(s.scheduledDate) < new Date()).length;

    // Chart data
    const maintenanceCost = [
        { month: 'Jul', preventive: 2500000, corrective: 5000000 },
        { month: 'Aug', preventive: 2000000, corrective: 3000000 },
        { month: 'Sep', preventive: 2800000, corrective: 8000000 },
        { month: 'Oct', preventive: 2200000, corrective: 1500000 },
        { month: 'Nov', preventive: 2500000, corrective: 2000000 },
        { month: 'Dec', preventive: 3000000, corrective: 9500000 },
    ];

    const typeBreakdown = useMemo(() => {
        const preventive = schedules.filter(s => s.type === 'Preventive').length;
        const corrective = schedules.filter(s => s.type === 'Corrective').length;
        return [
            { name: 'Preventive', value: preventive, color: '#22c55e' },
            { name: 'Corrective', value: corrective, color: '#ef4444' },
        ].filter(t => t.value > 0);
    }, [schedules]);

    const summaryCards = [
        { label: 'Jadwal Bulan Ini', value: scheduledThisMonth, icon: Calendar, color: 'blue' },
        { label: 'Sedang Berjalan', value: inProgress, icon: Clock, color: 'yellow' },
        { label: 'Selesai', value: completedThisMonth, icon: CheckCircle, color: 'green' },
        { label: 'Overdue', value: overdue, icon: AlertTriangle, color: 'red' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Maintenance</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Jadwal dan riwayat pemeliharaan mesin</p>
                </div>
                <Button onClick={modal.openCreate} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Jadwalkan Maintenance
                </Button>
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
                                    <p className="text-2xl font-bold">{card.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cost Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Biaya Maintenance (Rp)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={maintenanceCost}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000000}jt`} />
                                    <Tooltip formatter={(v) => formatCurrency(v)} />
                                    <Legend />
                                    <Bar dataKey="preventive" fill="#22c55e" name="Preventive" stackId="a" />
                                    <Bar dataKey="corrective" fill="#ef4444" name="Corrective" stackId="a" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Type Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Breakdown Tipe Maintenance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            {typeBreakdown.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={typeBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label>
                                            {typeBreakdown.map((entry, index) => (
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
            </div>

            {/* Tabs and Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('schedule')}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                    activeTab === 'schedule' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
                                )}
                            >
                                Jadwal ({upcomingSchedules.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                    activeTab === 'history' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
                                )}
                            >
                                Riwayat ({historySchedules.length})
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {activeTab === 'schedule' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Mesin</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Tipe</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Task</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Tanggal</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Teknisi</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcomingSchedules.length > 0 ? upcomingSchedules.map((schedule) => (
                                        <tr key={schedule.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{schedule.machine}</td>
                                            <td className="py-3 px-4">
                                                <span className={cn(
                                                    'px-2 py-1 rounded-full text-xs font-medium',
                                                    schedule.type === 'Preventive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                )}>
                                                    {schedule.type}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">{schedule.task}</td>
                                            <td className="py-3 px-4 text-sm">{schedule.scheduledDate}</td>
                                            <td className="py-3 px-4">
                                                <select
                                                    value={schedule.status}
                                                    onChange={(e) => handleStatusUpdate(schedule, e.target.value)}
                                                    className={cn(
                                                        'px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer',
                                                        schedule.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                                            schedule.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                                    )}
                                                >
                                                    <option value="upcoming">Upcoming</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </td>
                                            <td className="py-3 px-4">{schedule.technician}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => modal.openEdit(schedule)}
                                                        className="p-1.5 hover:bg-gray-100 rounded"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4 text-gray-500" />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDialog.openConfirm(schedule)}
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
                                            <td colSpan={7} className="py-8 text-center text-gray-400">Tidak ada jadwal maintenance</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Mesin</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Tipe</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Task</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Tanggal</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Durasi</th>
                                        <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Teknisi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historySchedules.length > 0 ? historySchedules.map((schedule) => (
                                        <tr key={schedule.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{schedule.machine}</td>
                                            <td className="py-3 px-4">
                                                <span className={cn(
                                                    'px-2 py-1 rounded-full text-xs font-medium',
                                                    schedule.type === 'Preventive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                )}>
                                                    {schedule.type}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">{schedule.task}</td>
                                            <td className="py-3 px-4 text-sm">{schedule.scheduledDate}</td>
                                            <td className="py-3 px-4">{schedule.estimatedDuration} jam</td>
                                            <td className="py-3 px-4">{schedule.technician}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-gray-400">Belum ada riwayat maintenance</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => { modal.close(); resetForm(); }}
                title={modal.mode === 'edit' ? 'Edit Jadwal Maintenance' : 'Jadwalkan Maintenance'}
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Tipe *</Label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            >
                                <option value="Preventive">Preventive</option>
                                <option value="Corrective">Corrective</option>
                            </select>
                        </div>
                        <div>
                            <Label>Tanggal *</Label>
                            <Input
                                type="date"
                                value={formData.scheduledDate}
                                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Task / Deskripsi *</Label>
                        <Input
                            value={formData.task}
                            onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                            placeholder="Deskripsi task"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Teknisi</Label>
                            <Input
                                value={formData.technician}
                                onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                                placeholder="Nama teknisi"
                            />
                        </div>
                        <div>
                            <Label>Estimasi Durasi (jam)</Label>
                            <Input
                                type="number"
                                min="1"
                                value={formData.estimatedDuration}
                                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                            />
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
                        <Button variant="outline" onClick={() => { modal.close(); resetForm(); }} className="flex-1">
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1"
                            disabled={!formData.machine || !formData.task || !formData.scheduledDate}
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
                        Apakah Anda yakin ingin menghapus jadwal maintenance untuk <strong>{confirmDialog.itemToDelete?.machine}</strong>?
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

export default MaintenanceProductionPage;
