import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, TrendingUp, DollarSign, Package, Zap, Users, Building, ArrowRight, Download, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label } from '@/components/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const CogmPage = () => {
    const { t } = useTranslation();

    // Cost Inputs
    const [costs, setCosts] = useState({
        materialCost: 8500000,      // Biaya bahan baku
        laborCost: 2500000,         // Biaya tenaga kerja
        electricityCost: 3200000,   // Biaya listrik
        depreciationCost: 1500000,  // Biaya penyusutan
        overheadCost: 800000,       // Biaya overhead lainnya
        packagingCost: 450000,      // Biaya packaging
        outputKg: 14170,            // Output produksi (kg)
    });

    // Calculate totals
    const totalCOGM = costs.materialCost + costs.laborCost + costs.electricityCost + costs.depreciationCost + costs.overheadCost + costs.packagingCost;
    const costPerKg = totalCOGM / costs.outputKg;
    const sellingPrice = 2200; // Harga jual per kg
    const grossMargin = ((sellingPrice - costPerKg) / sellingPrice * 100).toFixed(1);
    const profitPerKg = sellingPrice - costPerKg;

    const costBreakdown = [
        { name: 'Bahan Baku', value: costs.materialCost, color: '#3b82f6', icon: Package },
        { name: 'Tenaga Kerja', value: costs.laborCost, color: '#22c55e', icon: Users },
        { name: 'Listrik', value: costs.electricityCost, color: '#f59e0b', icon: Zap },
        { name: 'Penyusutan', value: costs.depreciationCost, color: '#8b5cf6', icon: Building },
        { name: 'Overhead', value: costs.overheadCost, color: '#ec4899', icon: TrendingUp },
        { name: 'Packaging', value: costs.packagingCost, color: '#06b6d4', icon: Package },
    ];

    const monthlyTrend = [
        { month: 'Jul', cogm: 1150, hpp: 1180 },
        { month: 'Aug', cogm: 1120, hpp: 1150 },
        { month: 'Sep', cogm: 1180, hpp: 1210 },
        { month: 'Oct', cogm: 1100, hpp: 1130 },
        { month: 'Nov', cogm: 1090, hpp: 1120 },
        { month: 'Dec', cogm: 1130, hpp: 1160 },
        { month: 'Jan', cogm: Math.round(costPerKg), hpp: Math.round(costPerKg * 1.03) },
    ];

    const handleChange = (field, value) => {
        setCosts(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">HPP & COGM Calculator</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Hitung Harga Pokok Produksi dan Cost of Goods Manufactured</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Reset
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/20">
                                <Calculator className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-white/80">Total COGM</p>
                                <p className="text-xl font-bold">{formatCurrency(totalCOGM)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/20">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-white/80">HPP per kg</p>
                                <p className="text-xl font-bold">{formatCurrency(Math.round(costPerKg))}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/20">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-white/80">Gross Margin</p>
                                <p className="text-xl font-bold">{grossMargin}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/20">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-white/80">Profit per kg</p>
                                <p className="text-xl font-bold">{formatCurrency(Math.round(profitPerKg))}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Calculator and Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cost Inputs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Input Biaya Produksi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {costBreakdown.map((cost) => (
                                <div key={cost.name}>
                                    <Label className="flex items-center gap-2">
                                        <cost.icon className="w-4 h-4" style={{ color: cost.color }} />
                                        {cost.name}
                                    </Label>
                                    <Input
                                        type="number"
                                        value={cost.value}
                                        onChange={(e) => {
                                            const field = cost.name === 'Bahan Baku' ? 'materialCost' :
                                                cost.name === 'Tenaga Kerja' ? 'laborCost' :
                                                    cost.name === 'Listrik' ? 'electricityCost' :
                                                        cost.name === 'Penyusutan' ? 'depreciationCost' :
                                                            cost.name === 'Overhead' ? 'overheadCost' : 'packagingCost';
                                            handleChange(field, e.target.value);
                                        }}
                                        className="mt-1"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t">
                            <Label className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Output Produksi (kg)
                            </Label>
                            <Input
                                type="number"
                                value={costs.outputKg}
                                onChange={(e) => handleChange('outputKg', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Cost Breakdown Pie */}
                <Card>
                    <CardHeader>
                        <CardTitle>Komposisi Biaya</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={costBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {costBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Summary & Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calculation Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ringkasan Kalkulasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {costBreakdown.map((cost) => (
                                <div key={cost.name} className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cost.color }} />
                                        <span>{cost.name}</span>
                                    </div>
                                    <span className="font-medium">{formatCurrency(cost.value)}</span>
                                </div>
                            ))}
                            <div className="flex items-center justify-between py-3 border-t-2 border-gray-200 font-bold">
                                <span>Total COGM</span>
                                <span className="text-[var(--color-primary)]">{formatCurrency(totalCOGM)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span>Output Produksi</span>
                                <span>{costs.outputKg.toLocaleString()} kg</span>
                            </div>
                            <div className="flex items-center justify-between py-3 bg-[var(--color-primary-light)] rounded-lg px-4 font-bold">
                                <span>HPP per kg</span>
                                <span className="text-[var(--color-primary)]">{formatCurrency(Math.round(costPerKg))}</span>
                            </div>
                        </div>

                        {/* Profit Analysis */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
                            <div className="flex justify-between">
                                <span>Harga Jual</span>
                                <span className="font-medium">{formatCurrency(sellingPrice)}/kg</span>
                            </div>
                            <div className="flex justify-between">
                                <span>HPP</span>
                                <span className="font-medium">{formatCurrency(Math.round(costPerKg))}/kg</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="font-bold">Profit</span>
                                <span className="font-bold text-green-600">{formatCurrency(Math.round(profitPerKg))}/kg ({grossMargin}%)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tren HPP Bulanan (Rp/kg)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
                                    <Legend />
                                    <Bar dataKey="cogm" fill="var(--color-primary)" name="COGM" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="hpp" fill="var(--color-secondary)" name="HPP" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CogmPage;
