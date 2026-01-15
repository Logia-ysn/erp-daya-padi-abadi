import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarClock, Clock, CheckCircle, AlertCircle, XCircle, Users, Plus, Search, Download, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, Input, Label } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useCrud, useModal, useConfirm } from '@/hooks/useCrud';
import { STORAGE_KEYS } from '@/services/api';
import { mockAttendance, mockEmployees } from '@/services/mockDataModules';
import { cn } from '@/lib/utils';

const AttendancePage = () => {
    const { t } = useTranslation();
    const { items: attendanceRecords, isLoading, create, update, remove } = useCrud(STORAGE_KEYS.ATTENDANCE, mockAttendance);
    const { items: employees } = useCrud(STORAGE_KEYS.EMPLOYEES, mockEmployees);
    const modal = useModal();
    const confirmDialog = useConfirm();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [formData, setFormData] = useState({
        employeeId: '',
        employeeName: '',
        date: selectedDate,
        clockIn: '',
        clockOut: '',
        status: 'present',
        overtime: 0,
        notes: ''
    });

    // Reset form
    const resetForm = () => {
        setFormData({
            employeeId: '',
            employeeName: '',
            date: selectedDate,
            clockIn: '',
            clockOut: '',
            status: 'present',
            overtime: 0,
            notes: ''
        });
    };

    // Handle employee selection
    const handleEmployeeSelect = (e) => {
        const employeeId = e.target.value;
        const employee = employees.find(emp => emp.id === employeeId);
        setFormData({
            ...formData,
            employeeId,
            employeeName: employee?.name || ''
        });
    };

    // Handle form open for edit
    useEffect(() => {
        if (modal.selectedItem && modal.mode === 'edit') {
            setFormData({
                employeeId: modal.selectedItem.employeeId || '',
                employeeName: modal.selectedItem.employeeName || '',
                date: modal.selectedItem.date || selectedDate,
                clockIn: modal.selectedItem.clockIn || '',
                clockOut: modal.selectedItem.clockOut || '',
                status: modal.selectedItem.status || 'present',
                overtime: modal.selectedItem.overtime || 0,
                notes: modal.selectedItem.notes || ''
            });
        } else {
            resetForm();
        }
    }, [modal.selectedItem, modal.mode]);

    // Calculate overtime based on clockOut
    const calculateOvertime = (clockOut) => {
        if (!clockOut) return 0;
        const [hours] = clockOut.split(':').map(Number);
        if (hours > 16) return hours - 16;
        return 0;
    };

    // Handle save
    const handleSave = async () => {
        const data = {
            ...formData,
            overtime: Number(formData.overtime) || calculateOvertime(formData.clockOut)
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

    // Filter by date
    const filteredAttendance = useMemo(() => {
        return attendanceRecords.filter(a => a.date === selectedDate);
    }, [attendanceRecords, selectedDate]);

    // Calculate statistics
    const totalEmployees = employees.length;
    const presentCount = filteredAttendance.filter(a => a.status === 'present').length;
    const lateCount = filteredAttendance.filter(a => a.status === 'late').length;
    const absentCount = filteredAttendance.filter(a => ['absent', 'sick'].includes(a.status)).length;

    const statusSummary = [
        { name: 'Hadir', value: presentCount, color: '#22c55e' },
        { name: 'Terlambat', value: lateCount, color: '#f59e0b' },
        { name: 'Sakit', value: filteredAttendance.filter(a => a.status === 'sick').length, color: '#3b82f6' },
        { name: 'Tidak Hadir', value: filteredAttendance.filter(a => a.status === 'absent').length, color: '#ef4444' },
    ].filter(s => s.value > 0);

    // Weekly summary - group by day
    const weeklyAttendance = useMemo(() => {
        const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        return days.map(day => {
            const count = Math.floor(Math.random() * 3) + 5; // Mock data
            return {
                day,
                present: count,
                late: Math.floor(Math.random() * 2),
                absent: Math.floor(Math.random() * 2)
            };
        });
    }, []);

    const summaryCards = [
        { label: 'Total Karyawan', value: totalEmployees, icon: Users, color: 'blue' },
        { label: 'Hadir Hari Ini', value: presentCount, icon: CheckCircle, color: 'green' },
        { label: 'Terlambat', value: lateCount, icon: AlertCircle, color: 'yellow' },
        { label: 'Tidak Hadir', value: absentCount, icon: XCircle, color: 'red' },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            present: 'bg-green-100 text-green-700',
            late: 'bg-yellow-100 text-yellow-700',
            sick: 'bg-blue-100 text-blue-700',
            absent: 'bg-red-100 text-red-700',
        };
        const labels = { present: 'Hadir', late: 'Terlambat', sick: 'Sakit', absent: 'Tidak Hadir' };
        return <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[status])}>{labels[status]}</span>;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Jam Masuk Kerja</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Monitor kehadiran dan absensi karyawan</p>
                </div>
                <div className="flex gap-2">
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-auto"
                    />
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                    <Button onClick={modal.openCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Catat Kehadiran
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
                                    <p className="text-2xl font-bold">{card.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Kehadiran Mingguan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyAttendance}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="present" stackId="a" fill="#22c55e" name="Hadir" />
                                    <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Terlambat" />
                                    <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Tidak Hadir" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Pie */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status Hari Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            {statusSummary.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={statusSummary} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label>
                                            {statusSummary.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">Belum ada data untuk tanggal ini</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                        <CardTitle>Detail Kehadiran - {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Cari karyawan..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Nama</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Jam Masuk</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Jam Keluar</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Lembur</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Catatan</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAttendance.length > 0 ? filteredAttendance.map((attendance) => (
                                    <tr key={attendance.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-medium text-sm">
                                                    {attendance.employeeName?.charAt(0) || '?'}
                                                </div>
                                                <span className="font-medium">{attendance.employeeName}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {attendance.clockIn ? (
                                                <span className="font-mono">{attendance.clockIn}</span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {attendance.clockOut ? (
                                                <span className="font-mono">{attendance.clockOut}</span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">{getStatusBadge(attendance.status)}</td>
                                        <td className="py-3 px-4">
                                            {attendance.overtime > 0 ? (
                                                <span className="text-blue-600 font-medium">{attendance.overtime} jam</span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{attendance.notes || '-'}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => modal.openEdit(attendance)}
                                                    className="p-1.5 hover:bg-gray-100 rounded"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDialog.openConfirm(attendance)}
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
                                        <td colSpan={7} className="py-8 text-center text-gray-400">Belum ada data kehadiran untuk tanggal ini</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Manual Entry Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => { modal.close(); resetForm(); }}
                title={modal.mode === 'edit' ? 'Edit Kehadiran' : 'Catat Kehadiran Manual'}
            >
                <div className="space-y-4">
                    <div>
                        <Label>Karyawan *</Label>
                        <select
                            value={formData.employeeId}
                            onChange={handleEmployeeSelect}
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        >
                            <option value="">Pilih Karyawan</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label>Tanggal</Label>
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Jam Masuk</Label>
                            <Input
                                type="time"
                                value={formData.clockIn}
                                onChange={(e) => setFormData({ ...formData, clockIn: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Jam Keluar</Label>
                            <Input
                                type="time"
                                value={formData.clockOut}
                                onChange={(e) => setFormData({ ...formData, clockOut: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Status</Label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            >
                                <option value="present">Hadir</option>
                                <option value="late">Terlambat</option>
                                <option value="sick">Sakit</option>
                                <option value="absent">Tidak Hadir</option>
                            </select>
                        </div>
                        <div>
                            <Label>Lembur (jam)</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.5"
                                value={formData.overtime}
                                onChange={(e) => setFormData({ ...formData, overtime: e.target.value })}
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
                            placeholder="Catatan opsional..."
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => { modal.close(); resetForm(); }} className="flex-1">
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1"
                            disabled={!formData.employeeId}
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
                        Apakah Anda yakin ingin menghapus data kehadiran <strong>{confirmDialog.itemToDelete?.employeeName}</strong>?
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

export default AttendancePage;
