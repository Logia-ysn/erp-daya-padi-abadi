import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Play, CheckCircle, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const UptimePage = () => {
    const { t } = useTranslation();
    const [selectedMachine, setSelectedMachine] = useState('all');

    const uptimeData = [
        { date: 'Sen', uptime: 22, downtime: 2 },
        { date: 'Sel', uptime: 20, downtime: 4 },
        { date: 'Rab', uptime: 23, downtime: 1 },
        { date: 'Kam', uptime: 18, downtime: 6 },
        { date: 'Jum', uptime: 21, downtime: 3 },
        { date: 'Sab', uptime: 12, downtime: 0 },
        { date: 'Min', uptime: 0, downtime: 0 },
    ];

    const machines = [
        { id: 'mch_001', name: 'Pellet Mill #1', uptime: 2450, totalHours: 2600, status: 'running', availability: 94.2 },
        { id: 'mch_002', name: 'Pellet Mill #2', uptime: 1890, totalHours: 2000, status: 'running', availability: 94.5 },
        { id: 'mch_003', name: 'Pellet Mill #3', uptime: 2200, totalHours: 2600, status: 'maintenance', availability: 84.6 },
        { id: 'mch_004', name: 'Dryer Unit', uptime: 1250, totalHours: 1400, status: 'running', availability: 89.3 },
        { id: 'mch_005', name: 'Hammer Mill', uptime: 980, totalHours: 1100, status: 'idle', availability: 89.1 },
    ];

    const pieData = [
        { name: 'Running', value: 3, color: '#22c55e' },
        { name: 'Maintenance', value: 1, color: '#eab308' },
        { name: 'Idle', value: 1, color: '#94a3b8' },
    ];

    const summaryStats = [
        { label: 'Total Uptime', value: '116 jam', subtext: 'Minggu ini', icon: Clock, color: 'green' },
        { label: 'Rata-rata Availability', value: '90.3%', subtext: 'Semua mesin', icon: TrendingUp, color: 'blue' },
        { label: 'Mesin Aktif', value: '3/5', subtext: 'Saat ini', icon: Play, color: 'purple' },
        { label: 'Total Downtime', value: '16 jam', subtext: 'Minggu ini', icon: AlertTriangle, color: 'red' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Up Time</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Monitor waktu operasional mesin</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedMachine}
                        onChange={(e) => setSelectedMachine(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                        <option value="all">Semua Mesin</option>
                        {machines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                        <Calendar className="w-4 h-4" />
                        Periode
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryStats.map((stat, idx) => (
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Uptime/Downtime Bar Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Uptime vs Downtime (Jam/Hari)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={uptimeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="uptime" stackId="a" fill="#22c55e" name="Uptime" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="downtime" stackId="a" fill="#ef4444" name="Downtime" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Machine Status Pie */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status Mesin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Machine Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Detail Uptime Per Mesin</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Mesin</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Uptime (jam)</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Total (jam)</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Availability</th>
                                </tr>
                            </thead>
                            <tbody>
                                {machines.map((machine) => (
                                    <tr key={machine.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{machine.name}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${machine.status === 'running' ? 'bg-green-100 text-green-700' :
                                                    machine.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {machine.status === 'running' && <Play className="w-3 h-3" />}
                                                {machine.status === 'maintenance' && <AlertTriangle className="w-3 h-3" />}
                                                {machine.status === 'idle' && <Clock className="w-3 h-3" />}
                                                {machine.status === 'running' ? 'Running' : machine.status === 'maintenance' ? 'Maintenance' : 'Idle'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">{machine.uptime.toLocaleString()}</td>
                                        <td className="py-3 px-4">{machine.totalHours.toLocaleString()}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[100px]">
                                                    <div
                                                        className={`h-2 rounded-full ${machine.availability >= 90 ? 'bg-green-500' : machine.availability >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                        style={{ width: `${machine.availability}%` }}
                                                    />
                                                </div>
                                                <span className="font-medium">{machine.availability}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UptimePage;
