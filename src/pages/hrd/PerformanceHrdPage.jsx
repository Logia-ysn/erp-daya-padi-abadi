import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, TrendingUp, TrendingDown, Award, Star, Calendar, Download, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, Input, Label } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useCrud, useModal, useConfirm } from '@/hooks/useCrud';
import { STORAGE_KEYS } from '@/services/api';
import { mockEmployees } from '@/services/mockDataModules';
import { cn } from '@/lib/utils';

const PerformanceHrdPage = () => {
    const { t } = useTranslation();
    const { items: employees, isLoading, create, update, remove } = useCrud(STORAGE_KEYS.EMPLOYEES, mockEmployees);
    const modal = useModal();
    const confirmDialog = useConfirm();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        attendance: 90,
        productivity: 85,
        quality: 85,
        teamwork: 85,
        discipline: 85
    });

    // Calculate score from metrics
    const calculateScore = (data) => {
        const { attendance, productivity, quality, teamwork, discipline } = data;
        return Math.round((Number(attendance) + Number(productivity) + Number(quality) + Number(teamwork) + Number(discipline)) / 5);
    };

    // Get status based on score
    const getStatus = (score) => {
        if (score >= 90) return 'excellent';
        if (score >= 80) return 'good';
        if (score >= 70) return 'needs_improvement';
        return 'poor';
    };

    // Handle form open for edit
    useEffect(() => {
        if (modal.selectedItem && modal.mode === 'edit') {
            setFormData({
                attendance: modal.selectedItem.attendance || 90,
                productivity: modal.selectedItem.productivity || 85,
                quality: modal.selectedItem.quality || 85,
                teamwork: modal.selectedItem.teamwork || 85,
                discipline: modal.selectedItem.discipline || 85
            });
        }
    }, [modal.selectedItem, modal.mode]);

    // Handle save performance
    const handleSave = async () => {
        if (modal.selectedItem) {
            const score = calculateScore(formData);
            const status = getStatus(score);
            await update(modal.selectedItem.id, {
                ...formData,
                attendance: Number(formData.attendance),
                productivity: Number(formData.productivity),
                quality: Number(formData.quality),
                teamwork: Number(formData.teamwork),
                discipline: Number(formData.discipline),
                score,
                performanceStatus: status
            });
        }
        modal.close();
    };

    // Employees with performance data
    const employeesWithPerformance = useMemo(() => {
        return employees.map(emp => ({
            ...emp,
            attendance: emp.attendance || Math.floor(Math.random() * 15) + 85,
            productivity: emp.productivity || Math.floor(Math.random() * 20) + 75,
            quality: emp.quality || Math.floor(Math.random() * 15) + 80,
            teamwork: emp.teamwork || Math.floor(Math.random() * 20) + 75,
            discipline: emp.discipline || Math.floor(Math.random() * 15) + 80,
            score: emp.score || Math.floor(Math.random() * 20) + 75,
            performanceStatus: emp.performanceStatus || getStatus(emp.score || 85)
        }));
    }, [employees]);

    // Filter employees
    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return employeesWithPerformance;
        return employeesWithPerformance.filter(emp =>
            emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [employeesWithPerformance, searchTerm]);

    // Calculate statistics
    const avgScore = employeesWithPerformance.length > 0
        ? Math.round(employeesWithPerformance.reduce((sum, e) => sum + (e.score || 85), 0) / employeesWithPerformance.length)
        : 0;
    const excellentCount = employeesWithPerformance.filter(e => (e.score || 85) >= 90).length;
    const needsImprovementCount = employeesWithPerformance.filter(e => (e.score || 85) < 80).length;

    // Performance trend mock data
    const performanceTrend = [
        { month: 'Jul', average: 82 },
        { month: 'Aug', average: 84 },
        { month: 'Sep', average: 83 },
        { month: 'Oct', average: 86 },
        { month: 'Nov', average: 87 },
        { month: 'Dec', average: 85 },
        { month: 'Jan', average: avgScore },
    ];

    // Radar data for team average
    const radarData = useMemo(() => {
        const avgAttendance = employeesWithPerformance.reduce((sum, e) => sum + (e.attendance || 90), 0) / (employeesWithPerformance.length || 1);
        const avgProductivity = employeesWithPerformance.reduce((sum, e) => sum + (e.productivity || 85), 0) / (employeesWithPerformance.length || 1);
        const avgQuality = employeesWithPerformance.reduce((sum, e) => sum + (e.quality || 85), 0) / (employeesWithPerformance.length || 1);
        const avgTeamwork = employeesWithPerformance.reduce((sum, e) => sum + (e.teamwork || 85), 0) / (employeesWithPerformance.length || 1);
        const avgDiscipline = employeesWithPerformance.reduce((sum, e) => sum + (e.discipline || 85), 0) / (employeesWithPerformance.length || 1);

        return [
            { subject: 'Kehadiran', A: Math.round(avgAttendance), fullMark: 100 },
            { subject: 'Produktivitas', A: Math.round(avgProductivity), fullMark: 100 },
            { subject: 'Kualitas', A: Math.round(avgQuality), fullMark: 100 },
            { subject: 'Teamwork', A: Math.round(avgTeamwork), fullMark: 100 },
            { subject: 'Disiplin', A: Math.round(avgDiscipline), fullMark: 100 },
        ];
    }, [employeesWithPerformance]);

    const getStatusBadge = (status) => {
        const styles = {
            excellent: 'bg-green-100 text-green-700',
            good: 'bg-blue-100 text-blue-700',
            needs_improvement: 'bg-yellow-100 text-yellow-700',
            poor: 'bg-red-100 text-red-700',
        };
        const labels = { excellent: 'Excellent', good: 'Good', needs_improvement: 'Perlu Perbaikan', poor: 'Poor' };
        return <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[status])}>{labels[status] || status}</span>;
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-blue-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const summaryCards = [
        { label: 'Skor Rata-rata', value: `${avgScore}%`, icon: Target, color: 'blue', gradient: true },
        { label: 'Excellent', value: `${excellentCount} orang`, icon: Award, color: 'green' },
        { label: 'Perlu Perbaikan', value: needsImprovementCount, icon: TrendingUp, color: 'yellow' },
        { label: 'Total Karyawan', value: employeesWithPerformance.length, icon: Star, color: 'purple' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Performa Karyawan</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Evaluasi dan penilaian kinerja</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Periode
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card, idx) => (
                    <Card key={idx} className={cn("hover:shadow-lg transition-shadow", card.gradient && "bg-gradient-to-br from-blue-500 to-blue-600 text-white")}>
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-3 rounded-xl", card.gradient ? "bg-white/20" : `bg-${card.color}-100`)}>
                                    <card.icon className={cn("w-6 h-6", card.gradient ? "text-white" : `text-${card.color}-600`)} />
                                </div>
                                <div>
                                    <p className={cn("text-sm", card.gradient ? "text-white/80" : "text-[var(--color-text-secondary)]")}>{card.label}</p>
                                    <p className="text-2xl font-bold">{card.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tren Performa Rata-rata</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={performanceTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(v) => `${v}%`} />
                                    <Bar dataKey="average" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Skor Rata-rata" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Radar */}
                <Card>
                    <CardHeader>
                        <CardTitle>Analisis Aspek Performa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={radarData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                    <Radar name="Rata-rata Tim" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Employee Table */}
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
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Karyawan</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Jabatan</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Kehadiran</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Produktivitas</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Kualitas</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Skor Total</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Status</th>
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
                                        <td className="py-3 px-4 text-sm">{employee.position}</td>
                                        <td className="py-3 px-4 text-center font-medium">{employee.attendance}%</td>
                                        <td className="py-3 px-4 text-center font-medium">{employee.productivity}%</td>
                                        <td className="py-3 px-4 text-center font-medium">{employee.quality}%</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={cn('font-bold text-lg', getScoreColor(employee.score))}>{employee.score}%</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">{getStatusBadge(employee.performanceStatus)}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => modal.openEdit(employee)}
                                                className="p-1.5 hover:bg-gray-100 rounded"
                                                title="Edit Performance"
                                            >
                                                <Edit className="w-4 h-4 text-gray-500" />
                                            </button>
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

            {/* Edit Performance Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={modal.close}
                title={`Nilai Performa - ${modal.selectedItem?.name || ''}`}
            >
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-lg">
                                {modal.selectedItem?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                                <h3 className="font-bold">{modal.selectedItem?.name}</h3>
                                <p className="text-sm text-gray-500">{modal.selectedItem?.position} - {modal.selectedItem?.department}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Kehadiran (%)</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.attendance}
                                onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Produktivitas (%)</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.productivity}
                                onChange={(e) => setFormData({ ...formData, productivity: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Kualitas (%)</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.quality}
                                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Teamwork (%)</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.teamwork}
                                onChange={(e) => setFormData({ ...formData, teamwork: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Disiplin (%)</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.discipline}
                                onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                            />
                        </div>
                        <div className="flex items-end">
                            <div className="p-3 bg-blue-50 rounded-lg w-full text-center">
                                <p className="text-sm text-blue-600">Skor Total</p>
                                <p className={cn("text-2xl font-bold", getScoreColor(calculateScore(formData)))}>
                                    {calculateScore(formData)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={modal.close} className="flex-1">
                            Batal
                        </Button>
                        <Button onClick={handleSave} className="flex-1">
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PerformanceHrdPage;
