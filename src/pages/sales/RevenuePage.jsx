import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Calendar, Download, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Line } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const RevenuePage = () => {
    const { t } = useTranslation();
    const [period, setPeriod] = useState('monthly');

    const revenueData = [
        { month: 'Jul', revenue: 145000000, target: 150000000, growth: -3.3 },
        { month: 'Aug', revenue: 158000000, target: 150000000, growth: 9.0 },
        { month: 'Sep', revenue: 142000000, target: 155000000, growth: -10.1 },
        { month: 'Oct', revenue: 168000000, target: 160000000, growth: 18.3 },
        { month: 'Nov', revenue: 175000000, target: 165000000, growth: 4.2 },
        { month: 'Dec', revenue: 182000000, target: 170000000, growth: 4.0 },
        { month: 'Jan', revenue: 177000000, target: 175000000, growth: -2.7 },
    ];

    const revenueByCustomer = [
        { name: 'PT PLN Pembangkitan', revenue: 110000000, percent: 62 },
        { name: 'PT Semen Indonesia', revenue: 45000000, percent: 25 },
        { name: 'CV Pabrik Tahu Murni', revenue: 15000000, percent: 9 },
        { name: 'Lainnya', revenue: 7000000, percent: 4 },
    ];

    const revenueByProduct = [
        { product: 'Pellet Curah', revenue: 145000000 },
        { product: 'Pellet 50kg', revenue: 25000000 },
        { product: 'Pellet Premium', revenue: 7000000 },
    ];

    const summaryCards = [
        { label: 'Total Revenue', value: formatCurrency(177000000), change: '+12.5%', trend: 'up', subtext: 'vs bulan lalu' },
        { label: 'Target Achievement', value: '101.1%', change: '+5.2%', trend: 'up', subtext: 'Target: Rp 175jt' },
        { label: 'Avg. Order Value', value: formatCurrency(58000000), change: '+8.3%', trend: 'up', subtext: '3 orders' },
        { label: 'YTD Revenue', value: formatCurrency(177000000), change: 'N/A', trend: 'neutral', subtext: 'Januari 2026' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Revenue</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Analisis pendapatan dan pencapaian target</p>
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
                            <p className="text-sm text-[var(--color-text-secondary)]">{card.label}</p>
                            <p className="text-2xl font-bold mt-1">{card.value}</p>
                            <div className="flex items-center gap-2 mt-2">
                                {card.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-600" />}
                                {card.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-600" />}
                                <span className={`text-sm ${card.trend === 'up' ? 'text-green-600' : card.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                                    {card.change}
                                </span>
                                <span className="text-sm text-gray-400">{card.subtext}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Revenue Trend Chart */}
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Tren Revenue</CardTitle>
                    <div className="flex gap-2">
                        {['weekly', 'monthly', 'yearly'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${period === p ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                {p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={revenueData}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000000}jt`} />
                                <Tooltip formatter={(v) => formatCurrency(v)} />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" fill="url(#revGrad)" stroke="var(--color-primary)" strokeWidth={2} name="Revenue" />
                                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} name="Target" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* By Customer */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Customer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {revenueByCustomer.map((customer, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{customer.name}</span>
                                        <span className="text-sm text-gray-500">{formatCurrency(customer.revenue)} ({customer.percent}%)</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full">
                                        <div
                                            className="h-2 bg-[var(--color-primary)] rounded-full"
                                            style={{ width: `${customer.percent}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* By Product */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueByProduct} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis type="number" tickFormatter={(v) => `${v / 1000000}jt`} tick={{ fontSize: 12 }} />
                                    <YAxis dataKey="product" type="category" tick={{ fontSize: 12 }} width={100} />
                                    <Tooltip formatter={(v) => formatCurrency(v)} />
                                    <Bar dataKey="revenue" fill="var(--color-secondary)" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RevenuePage;
