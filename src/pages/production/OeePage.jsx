import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Target, Gauge, HelpCircle, Download, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Area } from 'recharts';
import { cn } from '@/lib/utils';

const OeePage = () => {
    const { t } = useTranslation();
    const [period, setPeriod] = useState('weekly');

    // OEE = Availability × Performance × Quality
    const oeeData = useMemo(() => [
        { date: '01 Jan', availability: 92, performance: 88, quality: 98, oee: 79.4 },
        { date: '02 Jan', availability: 88, performance: 85, quality: 97, oee: 72.5 },
        { date: '03 Jan', availability: 95, performance: 91, quality: 99, oee: 85.6 },
        { date: '04 Jan', availability: 90, performance: 87, quality: 98, oee: 76.7 },
        { date: '05 Jan', availability: 93, performance: 89, quality: 98, oee: 81.1 },
        { date: '06 Jan', availability: 50, performance: 80, quality: 95, oee: 38.0 },
        { date: '07 Jan', availability: 0, performance: 0, quality: 0, oee: 0 },
        { date: '08 Jan', availability: 96, performance: 92, quality: 99, oee: 87.4 },
        { date: '09 Jan', availability: 97, performance: 94, quality: 99, oee: 90.3 },
        { date: '10 Jan', availability: 85, performance: 82, quality: 96, oee: 67.0 },
        { date: '11 Jan', availability: 94, performance: 90, quality: 98, oee: 82.9 },
        { date: '12 Jan', availability: 93, performance: 89, quality: 98, oee: 81.1 },
    ], []);

    const machineOee = [
        { name: 'Pellet Mill #1', availability: 94, performance: 91, quality: 99, oee: 84.7 },
        { name: 'Pellet Mill #2', availability: 97, performance: 94, quality: 99, oee: 90.3 },
        { name: 'Pellet Mill #3', availability: 0, performance: 0, quality: 0, oee: 0 },
        { name: 'Dryer Unit', availability: 89, performance: 85, quality: 97, oee: 73.4 },
        { name: 'Hammer Mill', availability: 0, performance: 0, quality: 0, oee: 0 },
    ];

    const avgOee = useMemo(() => {
        const validData = oeeData.filter(d => d.oee > 0);
        return (validData.reduce((sum, d) => sum + d.oee, 0) / validData.length).toFixed(1);
    }, [oeeData]);

    const oeeMetrics = [
        { label: 'OEE Rata-rata', value: `${avgOee}%`, color: parseFloat(avgOee) >= 85 ? 'green' : parseFloat(avgOee) >= 70 ? 'yellow' : 'red', icon: BarChart3 },
        { label: 'Availability', value: '91.2%', color: 'blue', icon: Target },
        { label: 'Performance', value: '88.5%', color: 'purple', icon: TrendingUp },
        { label: 'Quality', value: '97.8%', color: 'green', icon: Gauge },
    ];

    const getOeeClass = (oee) => {
        if (oee >= 85) return 'text-green-600 bg-green-100';
        if (oee >= 70) return 'text-yellow-600 bg-yellow-100';
        if (oee > 0) return 'text-red-600 bg-red-100';
        return 'text-gray-400 bg-gray-100';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">OEE (Overall Equipment Effectiveness)</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Ukur efektivitas peralatan produksi</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" /> Panduan OEE
                    </Button>
                </div>
            </div>

            {/* OEE Formula Banner */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-4">
                    <div className="flex items-center justify-center gap-4 text-center">
                        <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                            <p className="text-xs text-gray-500">Availability</p>
                            <p className="text-lg font-bold text-blue-600">91.2%</p>
                        </div>
                        <span className="text-2xl font-bold text-gray-400">×</span>
                        <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                            <p className="text-xs text-gray-500">Performance</p>
                            <p className="text-lg font-bold text-purple-600">88.5%</p>
                        </div>
                        <span className="text-2xl font-bold text-gray-400">×</span>
                        <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                            <p className="text-xs text-gray-500">Quality</p>
                            <p className="text-lg font-bold text-green-600">97.8%</p>
                        </div>
                        <span className="text-2xl font-bold text-gray-400">=</span>
                        <div className="px-6 py-2 bg-[var(--color-primary)] rounded-lg shadow-sm">
                            <p className="text-xs text-white/80">OEE</p>
                            <p className="text-2xl font-bold text-white">{avgOee}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {oeeMetrics.map((metric, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-${metric.color}-100`}>
                                    <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">{metric.label}</p>
                                    <p className="text-2xl font-bold">{metric.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* OEE Trend Chart */}
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Tren OEE</CardTitle>
                    <div className="flex gap-2">
                        {['daily', 'weekly', 'monthly'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                                    period === p
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                )}
                            >
                                {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : 'Bulanan'}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={oeeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="oee" fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" strokeWidth={2} name="OEE (%)" />
                                <Line type="monotone" dataKey="availability" stroke="#3b82f6" strokeDasharray="5 5" name="Availability (%)" />
                                <Line type="monotone" dataKey="performance" stroke="#a855f7" strokeDasharray="5 5" name="Performance (%)" />
                                <Line type="monotone" dataKey="quality" stroke="#22c55e" strokeDasharray="5 5" name="Quality (%)" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* OEE per Machine */}
            <Card>
                <CardHeader>
                    <CardTitle>OEE Per Mesin</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Mesin</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Availability</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Performance</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Quality</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">OEE</th>
                                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text-secondary)]">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {machineOee.map((machine, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{machine.name}</td>
                                        <td className="py-3 px-4 text-center">{machine.availability > 0 ? `${machine.availability}%` : '-'}</td>
                                        <td className="py-3 px-4 text-center">{machine.performance > 0 ? `${machine.performance}%` : '-'}</td>
                                        <td className="py-3 px-4 text-center">{machine.quality > 0 ? `${machine.quality}%` : '-'}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={cn('px-3 py-1 rounded-full text-sm font-bold', getOeeClass(machine.oee))}>
                                                {machine.oee > 0 ? `${machine.oee}%` : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={cn(
                                                'px-2 py-1 rounded-full text-xs font-medium',
                                                machine.oee >= 85 ? 'bg-green-100 text-green-700' :
                                                    machine.oee >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                                        machine.oee > 0 ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-500'
                                            )}>
                                                {machine.oee >= 85 ? 'World Class' : machine.oee >= 70 ? 'Typical' : machine.oee > 0 ? 'Low' : 'Offline'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* OEE Legend */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Standar OEE:</p>
                        <div className="flex gap-6 text-sm">
                            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> World Class: ≥ 85%</span>
                            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500" /> Typical: 70-84%</span>
                            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500" /> Low: &lt; 70%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OeePage;
