import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UsersRound, Users, UserCheck, Building, Calendar, Download, GraduationCap, Clock, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, Input, Label } from '@/components/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useCrud, useModal, useConfirm } from '@/hooks/useCrud';
import { STORAGE_KEYS } from '@/services/api';
import { mockEmployees } from '@/services/mockDataModules';
import { cn } from '@/lib/utils';

const DemographyPage = () => {
    const { t } = useTranslation();
    const { items: employees, isLoading, create, update, remove } = useCrud(STORAGE_KEYS.EMPLOYEES, mockEmployees);
    const modal = useModal();
    const confirmDialog = useConfirm();
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        department: 'Produksi',
        age: 25,
        gender: 'Male',
        education: 'SMA',
        hireDate: '',
        phone: '',
        email: '',
        salary: 4000000,
        status: 'active'
    });

    const departments = ['Produksi', 'Maintenance', 'Admin', 'Logistik', 'Security', 'Warehouse'];
    const educations = ['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2'];

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            position: '',
            department: 'Produksi',
            age: 25,
            gender: 'Male',
            education: 'SMA',
            hireDate: new Date().toISOString().split('T')[0],
            phone: '',
            email: '',
            salary: 4000000,
            status: 'active'
        });
    };

    // Handle form open for edit
    useEffect(() => {
        if (modal.selectedItem && modal.mode === 'edit') {
            setFormData({
                name: modal.selectedItem.name || '',
                position: modal.selectedItem.position || '',
                department: modal.selectedItem.department || 'Produksi',
                age: modal.selectedItem.age || 25,
                gender: modal.selectedItem.gender || 'Male',
                education: modal.selectedItem.education || 'SMA',
                hireDate: modal.selectedItem.hireDate || '',
                phone: modal.selectedItem.phone || '',
                email: modal.selectedItem.email || '',
                salary: modal.selectedItem.salary || 4000000,
                status: modal.selectedItem.status || 'active'
            });
        } else {
            resetForm();
        }
    }, [modal.selectedItem, modal.mode]);

    // Calculate tenure from hire date
    const calculateTenure = (hireDate) => {
        if (!hireDate) return 0;
        const hire = new Date(hireDate);
        const now = new Date();
        return Math.floor((now - hire) / (1000 * 60 * 60 * 24 * 365));
    };

    // Handle save
    const handleSave = async () => {
        const data = {
            ...formData,
            age: Number(formData.age),
            salary: Number(formData.salary),
            tenure: calculateTenure(formData.hireDate)
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

    // Filter employees
    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return employees;
        return employees.filter(emp =>
            emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [employees, searchTerm]);

    // Chart data
    const byDepartment = useMemo(() => {
        const colors = {
            'Produksi': '#3b82f6',
            'Maintenance': '#22c55e',
            'Admin': '#f59e0b',
            'Logistik': '#8b5cf6',
            'Security': '#ef4444',
            'Warehouse': '#06b6d4'
        };
        return Object.entries(
            employees.reduce((acc, emp) => {
                acc[emp.department] = (acc[emp.department] || 0) + 1;
                return acc;
            }, {})
        ).map(([name, value]) => ({
            name,
            value,
            color: colors[name] || '#6b7280'
        }));
    }, [employees]);

    const byGender = useMemo(() => {
        const male = employees.filter(e => e.gender === 'Male').length;
        const female = employees.filter(e => e.gender === 'Female').length;
        return [
            { name: 'Laki-laki', value: male, color: '#3b82f6' },
            { name: 'Perempuan', value: female, color: '#ec4899' },
        ].filter(g => g.value > 0);
    }, [employees]);

    const byEducation = useMemo(() => {
        return Object.entries(
            employees.reduce((acc, emp) => {
                acc[emp.education] = (acc[emp.education] || 0) + 1;
                return acc;
            }, {})
        ).map(([education, count]) => ({ education, count }));
    }, [employees]);

    const byAge = useMemo(() => {
        const ranges = { '20-29': 0, '30-39': 0, '40-49': 0, '50+': 0 };
        employees.forEach(emp => {
            const age = emp.age || 30;
            if (age < 30) ranges['20-29']++;
            else if (age < 40) ranges['30-39']++;
            else if (age < 50) ranges['40-49']++;
            else ranges['50+']++;
        });
        return Object.entries(ranges).map(([range, count]) => ({ range, count }));
    }, [employees]);

    // Statistics
    const avgAge = employees.length > 0
        ? Math.round(employees.reduce((sum, e) => sum + (e.age || 30), 0) / employees.length)
        : 0;
    const avgTenure = employees.length > 0
        ? (employees.reduce((sum, e) => sum + (e.tenure || calculateTenure(e.hireDate)), 0) / employees.length).toFixed(1)
        : 0;

    const summaryCards = [
        { label: 'Total Karyawan', value: employees.length, icon: Users, color: 'blue' },
        { label: 'Rata-rata Usia', value: `${avgAge} tahun`, icon: Calendar, color: 'green' },
        { label: 'Rata-rata Masa Kerja', value: `${avgTenure} tahun`, icon: Clock, color: 'purple' },
        { label: 'Departemen', value: byDepartment.length, icon: Building, color: 'orange' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Demografi Karyawan</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Analisis data demografis karyawan</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                    <Button onClick={modal.openCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Tambah Karyawan
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

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* By Department */}
                <Card>
                    <CardHeader>
                        <CardTitle>Per Departemen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-56">
                            {byDepartment.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={byDepartment} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                                            {byDepartment.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">Belum ada data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* By Gender */}
                <Card>
                    <CardHeader>
                        <CardTitle>Per Gender</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-56">
                            {byGender.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={byGender} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                                            {byGender.map((entry, index) => (
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

                {/* By Education */}
                <Card>
                    <CardHeader>
                        <CardTitle>Per Pendidikan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-56">
                            {byEducation.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={byEducation} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis type="number" tick={{ fontSize: 12 }} />
                                        <YAxis dataKey="education" type="category" tick={{ fontSize: 12 }} width={40} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 4, 4, 0]} name="Jumlah" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">Belum ada data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* By Age */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribusi Usia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={byAge}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} name="Jumlah Karyawan" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Empty space or add another chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ringkasan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg text-center">
                                <p className="text-sm text-blue-600">Karyawan Aktif</p>
                                <p className="text-3xl font-bold text-blue-700">{employees.filter(e => e.status === 'active').length}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg text-center">
                                <p className="text-sm text-green-600">Rata-rata Usia</p>
                                <p className="text-3xl font-bold text-green-700">{avgAge}</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg text-center">
                                <p className="text-sm text-purple-600">Departemen</p>
                                <p className="text-3xl font-bold text-purple-700">{byDepartment.length}</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg text-center">
                                <p className="text-sm text-orange-600">Avg. Masa Kerja</p>
                                <p className="text-3xl font-bold text-orange-700">{avgTenure} th</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Employee List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                        <CardTitle>Daftar Karyawan</CardTitle>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari karyawan..."
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
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Nama</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Departemen</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Jabatan</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Usia</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Gender</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Pendidikan</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Masa Kerja</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.length > 0 ? filteredEmployees.map((employee) => (
                                    <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-medium text-sm">
                                                    {employee.name?.charAt(0) || '?'}
                                                </div>
                                                <span className="font-medium">{employee.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{employee.department}</td>
                                        <td className="py-3 px-4">{employee.position}</td>
                                        <td className="py-3 px-4 text-center">{employee.age} th</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={cn(
                                                'px-2 py-1 rounded-full text-xs font-medium',
                                                employee.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                                            )}>
                                                {employee.gender === 'Male' ? 'L' : 'P'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">{employee.education}</td>
                                        <td className="py-3 px-4 text-center">{employee.tenure || calculateTenure(employee.hireDate)} th</td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="flex gap-1 justify-center">
                                                <button
                                                    onClick={() => modal.openEdit(employee)}
                                                    className="p-1.5 hover:bg-gray-100 rounded"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDialog.openConfirm(employee)}
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
                                        <td colSpan={8} className="py-8 text-center text-gray-400">Tidak ada data karyawan</td>
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
                title={modal.mode === 'edit' ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
            >
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <Label>Nama Lengkap *</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nama karyawan"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Departemen *</Label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            >
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label>Jabatan *</Label>
                            <Input
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                placeholder="Jabatan"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Usia</Label>
                            <Input
                                type="number"
                                min="18"
                                max="65"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Gender</Label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            >
                                <option value="Male">Laki-laki</option>
                                <option value="Female">Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <Label>Pendidikan</Label>
                            <select
                                value={formData.education}
                                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            >
                                {educations.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Tanggal Masuk</Label>
                            <Input
                                type="date"
                                value={formData.hireDate}
                                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Gaji (Rp)</Label>
                            <Input
                                type="number"
                                value={formData.salary}
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>No. Telepon</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="08xx-xxxx-xxxx"
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@company.com"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => { modal.close(); resetForm(); }} className="flex-1">
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1"
                            disabled={!formData.name || !formData.position}
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
                        Apakah Anda yakin ingin menghapus data karyawan <strong>{confirmDialog.itemToDelete?.name}</strong>?
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

export default DemographyPage;
