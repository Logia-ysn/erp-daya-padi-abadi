import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download, DollarSign, Package, Zap, Users, Building } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, ComposedChart, Area } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const CogmAnalysisPage = () => {
    const { t } = useTranslation();
    const [period, setPeriod] = useState('monthly');

    const cogmTrend = [
        { month: 'Jul', cogm: 1150, revenue: 1580, margin: 27.2 },
        { month: 'Aug', cogm: 1120, revenue: 1620, margin: 30.9 },
        { month: 'Sep', cogm: 1180, revenue: 1480, margin: 20.3 },
        { month: 'Oct', cogm: 1100, revenue: 1720, margin: 36.0 },
        { month: 'Nov', cogm: 1090, revenue: 1750, margin: 37.7 },
        { month: 'Dec', cogm: 1130, revenue: 1820, margin: 37.9 },
        { month: 'Jan', cogm: 1168, revenue: 1770, margin: 34.0 },
    ];

    const costBreakdown = [
        { month: 'Jul', material: 650, labor: 200, electric: 180, depreciation: 80, overhead: 40 },
        { month: 'Aug', material: 620, labor: 200, electric: 180, depreciation: 80, overhead: 40 },
        { month: 'Sep', material: 680, labor: 200, electric: 180, depreciation: 80, overhead: 40 },
        { month: 'Oct', material: 600, labor: 200, electric: 180, depreciation: 80, overhead: 40 },
        { month: 'Nov', material: 590, labor: 200, electric: 180, depreciation: 80, overhead: 40 },
        { month: 'Dec', material: 630, labor: 200, electric: 180, depreciation: 80, overhead: 40 },
        { month: 'Jan', material: 668, labor: 200, electric: 180, depreciation: 80, overhead: 40 },
    ];

    const currentCogm = cogmTrend[cogmTrend.length - 1];
    const previousCogm = cogmTrend[cogmTrend.length - 2];
    const cogmChange = ((currentCogm.cogm - previousCogm.cogm) / previousCogm.cogm * 100).toFixed(1);

    const summaryCards = [
        {
            label: 'COGM/kg',
            value: `Rp ${currentCogm.cogm}`,
            change: `${cogmChange}%`,
            trend: parseFloat(cogmChange) <= 0 ? 'up' : 'down',
            icon: DollarSign,
            color: 'blue'
        },
        {
            label: 'Revenue/kg',
            value: `Rp ${currentCogm.revenue}`,
            change: '+2.8%',
            trend: 'up',
            icon: TrendingUp,
            color: 'green'
        },
        {
            label: 'Gross Margin',
            value: `${currentCogm.margin}%`,
            change: '-3.9%',
            trend: 'down',
            icon: BarChart3,
            color: 'purple'
        },
        {
            label: 'Profit/kg',
            value: `Rp ${currentCogm.revenue - currentCogm.cogm}`,
            change: '-1.5%',
            trend: 'down',
            icon: Package,
            color: 'orange'
        },
    ];

    const costComponents = [
        { name: 'Bahan Baku', value: 668, percent: 57.2, icon: Package, color: '#3b82f6' },
        { name: 'Tenaga Kerja', value: 200, percent: 17.1, icon: Users, color: '#22c55e' },
        { name: 'Listrik', value: 180, percent: 15.4, icon: Zap, color: '#f59e0b' },
        { name: 'Penyusutan', value: 80, percent: 6.8, icon: Building, color: '#8b5cf6' },
        { name: 'Overhead', value: 40, percent: 3.4, icon: TrendingUp, color: '#ec4899' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">COGM Analysis</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Analisis Cost of Goods Manufactured</p>
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
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-${card.color}-100`}>
                                    <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">{card.label}</p>
                                    <p className="text-xl font-bold">{card.value}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        {card.trend === 'up' ? (
                                            <TrendingUp className="w-3 h-3 text-green-600" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3 text-red-600" />
                                        )}
                                        <span className={`text-xs ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            {card.change}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* COGM vs Revenue Trend */}
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Tren COGM vs Revenue (Rp/kg)</CardTitle>
                    <div className="flex gap-2">
                        {['monthly', 'quarterly', 'yearly'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${period === p ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                {p === 'monthly' ? 'Bulanan' : p === 'quarterly' ? 'Kuartal' : 'Tahunan'}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={cogmTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} unit="%" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="cogm" fill="#ef4444" name="COGM (Rp/kg)" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="left" dataKey="revenue" fill="#22c55e" name="Revenue (Rp/kg)" radius={[4, 4, 0, 0]} />
                                <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#3b82f6" strokeWidth={2} name="Margin (%)" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Component Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Komposisi Biaya (Rp/kg)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {costComponents.map((component, idx) => (
                                <div key={idx}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: component.color }} />
                                            <span className="text-sm font-medium">{component.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-medium">Rp {component.value}</span>
                                            <span className="text-gray-400 text-sm ml-2">({component.percent}%)</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full">
                                        <div
                                            className="h-2 rounded-full transition-all"
                                            style={{ width: `${component.percent}%`, backgroundColor: component.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 border-t mt-4">
                                <div className="flex justify-between font-bold">
                                    <span>Total COGM</span>
                                    <span>Rp {costComponents.reduce((sum, c) => sum + c.value, 0)}/kg</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stacked Cost Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tren Komposisi Biaya</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={costBreakdown}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="material" stackId="a" fill="#3b82f6" name="Bahan Baku" />
                                    <Bar dataKey="labor" stackId="a" fill="#22c55e" name="Tenaga Kerja" />
                                    <Bar dataKey="electric" stackId="a" fill="#f59e0b" name="Listrik" />
                                    <Bar dataKey="depreciation" stackId="a" fill="#8b5cf6" name="Penyusutan" />
                                    <Bar dataKey="overhead" stackId="a" fill="#ec4899" name="Overhead" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Insights */}
            <Card>
                <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-800">Biaya Tertinggi</h4>
                            <p className="text-2xl font-bold text-blue-600 mt-1">Bahan Baku</p>
                            <p className="text-sm text-blue-700 mt-1">57.2% dari total COGM</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-medium text-green-800">Margin Tertinggi</h4>
                            <p className="text-2xl font-bold text-green-600 mt-1">Desember 2025</p>
                            <p className="text-sm text-green-700 mt-1">37.9% gross margin</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                            <h4 className="font-medium text-orange-800">Rekomendasi</h4>
                            <p className="text-sm text-orange-700 mt-1">Optimasi biaya bahan baku dapat meningkatkan margin hingga 5%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CogmAnalysisPage;
