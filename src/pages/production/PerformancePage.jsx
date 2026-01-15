import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Activity, TrendingUp, TrendingDown, Clock, Target, Zap,
    ArrowUpRight, ArrowDownRight, FileText
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useCrud } from '@/hooks';
import { mockWorksheets } from '@/services/mockData';
import { getPerformanceFromWorksheets } from '@/services/worksheetIntegration';
import { formatDateShort } from '@/lib/utils';

const PerformancePage = () => {
    const { t } = useTranslation();
    const [period, setPeriod] = useState('weekly');

    // Get worksheet data
    const { items: worksheets } = useCrud('erp_worksheets', mockWorksheets);

    // Calculate performance from worksheets
    const performanceMetrics = useMemo(() => {
        return getPerformanceFromWorksheets(worksheets);
    }, [worksheets]);

    // Prepare chart data from worksheets
    const performanceData = useMemo(() => {
        return worksheets.map(ws => {
            const achievement = ws.targetProduction > 0
                ? ((ws.actualProduction / ws.targetProduction) * 100).toFixed(1)
                : 0;

            return {
                date: formatDateShort(ws.productionDate),
                efficiency: parseFloat(achievement),
                target: 100,
                output: ws.actualProduction
            };
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [worksheets]);

    // Machine performance from worksheets
    const machinePerformance = useMemo(() => {
        return performanceMetrics.byMachine.map(m => ({
            name: m.machineName,
            efficiency: parseFloat(m.achievement),
            status: parseFloat(m.achievement) > 0 ? 'running' : 'idle',
            output: m.totalActual,
            worksheetCount: m.worksheetCount
        }));
    }, [performanceMetrics]);

    // Calculate KPI cards from real data
    const avgEfficiency = performanceMetrics.overall.avgAchievement;
    const totalOutput = performanceMetrics.overall.totalActual;
    const targetAchievement = performanceMetrics.overall.avgAchievement;

    // Calculate productivity per hour (assuming 8 hour shifts)
    const totalWorksheets = performanceMetrics.overall.worksheetCount;
    const productivityPerHour = totalWorksheets > 0 ? (totalOutput / (totalWorksheets * 8)).toFixed(0) : 0;

    const kpiCards = [
        {
            label: 'Achievement Rate',
            value: `${avgEfficiency}%`,
            change: avgEfficiency >= 100 ? '+' + (avgEfficiency - 100).toFixed(1) + '%' : (avgEfficiency - 100).toFixed(1) + '%',
            trend: avgEfficiency >= 100 ? 'up' : 'down',
            icon: Activity,
            color: 'green',
            source: 'From Worksheets'
        },
        {
            label: 'Total Output',
            value: `${totalOutput.toLocaleString()} kg`,
            change: `${totalWorksheets} worksheets`,
            trend: 'up',
            icon: TrendingUp,
            color: 'blue',
            source: 'From Worksheets'
        },
        {
            label: 'Target Achievement',
            value: `${targetAchievement}%`,
            change: `Target: ${performanceMetrics.overall.totalTarget.toLocaleString()} kg`,
            trend: targetAchievement >= 100 ? 'up' : 'down',
            icon: Target,
            color: 'purple',
            source: 'From Worksheets'
        },
        {
            label: 'Produktivitas/Jam',
            value: `${productivityPerHour} kg`,
            change: `Avg per shift`,
            trend: 'up',
            icon: Zap,
            color: 'orange',
            source: 'From Worksheets'
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Performa Produksi</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Monitor efisiensi dan produktivitas mesin</p>
                </div>
                <div className="flex gap-2">
                    {['daily', 'weekly', 'monthly'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'bg-white text-[var(--color-text-secondary)] hover:bg-gray-100'
                                }`}
                        >
                            {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : 'Bulanan'}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm text-[var(--color-text-secondary)]">{kpi.label}</p>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            Worksheet
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                                    <div className={`flex items-center gap-1 mt-2 text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                        {kpi.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                        <span>{kpi.change}</span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-xl bg-${kpi.color}-100`}>
                                    <kpi.icon className={`w-6 h-6 text-${kpi.color}-600`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Efficiency Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tren Efisiensi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="efficiency" stroke="var(--color-primary)" fill="url(#effGrad)" name="Efisiensi (%)" />
                                    <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" name="Target (%)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Output Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Output Produksi (kg)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="output" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} name="Output (kg)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Machine Performance Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Performa Per Mesin (From Worksheets)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Mesin</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Achievement</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Total Output</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Worksheets</th>
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {machinePerformance.map((machine, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{machine.name}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${machine.status === 'running' ? 'bg-green-100 text-green-700' :
                                                machine.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {machine.status === 'running' ? 'Berjalan' : machine.status === 'maintenance' ? 'Maintenance' : 'Idle'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`font-bold ${machine.efficiency >= 100 ? 'text-green-600' : machine.efficiency >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {machine.efficiency}%
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-medium">{machine.output.toLocaleString()} kg</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 flex items-center gap-1 w-fit">
                                                <FileText className="w-3 h-3" />
                                                {machine.worksheetCount}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${machine.efficiency >= 100 ? 'bg-green-500' : machine.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${Math.min(machine.efficiency, 100)}%` }}
                                                />
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

export default PerformancePage;
