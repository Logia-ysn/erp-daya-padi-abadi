import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, FileText, TrendingUp, PieChart, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label } from '@/components/ui';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';

const FinancePage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('cogs');
    const [cogsForm, setCogsForm] = useState({
        materialCost: 10000000,
        electricCost: 2500000,
        laborCost: 3000000,
        depreciationCost: 1500000,
        outputQty: 10000,
    });

    const tabs = [
        { id: 'cogs', label: t('finance.cogsCalculator'), icon: Calculator },
        { id: 'costs', label: t('finance.costReports'), icon: FileText },
        { id: 'revenue', label: t('finance.revenueReports'), icon: TrendingUp },
        { id: 'margins', label: t('finance.profitMargins'), icon: PieChart },
    ];

    const totalCogs = cogsForm.materialCost + cogsForm.electricCost + cogsForm.laborCost + cogsForm.depreciationCost;
    const unitCost = cogsForm.outputQty > 0 ? totalCogs / cogsForm.outputQty : 0;
    const sellingPrice = 2500;
    const grossMargin = sellingPrice > 0 ? ((sellingPrice - unitCost) / sellingPrice * 100) : 0;

    const cogsBreakdown = [
        { name: t('finance.materialCost'), value: cogsForm.materialCost, color: '#3B82F6' },
        { name: t('finance.electricCost'), value: cogsForm.electricCost, color: '#F97316' },
        { name: t('finance.laborCost'), value: cogsForm.laborCost, color: '#10B981' },
        { name: t('finance.depreciationCost'), value: cogsForm.depreciationCost, color: '#8B5CF6' },
    ];

    const monthlyProfit = [
        { month: 'Jul', revenue: 145000000, cogs: 95000000 },
        { month: 'Aug', revenue: 158000000, cogs: 102000000 },
        { month: 'Sep', revenue: 142000000, cogs: 98000000 },
        { month: 'Oct', revenue: 168000000, cogs: 105000000 },
        { month: 'Nov', revenue: 175000000, cogs: 110000000 },
        { month: 'Dec', revenue: 182000000, cogs: 115000000 },
    ].map(m => ({ ...m, profit: m.revenue - m.cogs }));

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('finance.title')}</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Track costs, revenue, and profit margins</p>
                </div>
                <Button><Plus className="w-4 h-4 mr-2" />Export Report</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4"><p className="text-sm text-[var(--color-text-secondary)]">{t('finance.totalCogs')}</p><p className="text-2xl font-bold text-[var(--color-text-primary)]">{formatCurrency(totalCogs)}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-[var(--color-text-secondary)]">{t('finance.unitCost')}</p><p className="text-2xl font-bold text-[var(--color-primary)]">{formatCurrency(unitCost)}/kg</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-[var(--color-text-secondary)]">{t('finance.sellingPrice')}</p><p className="text-2xl font-bold text-[var(--color-success)]">{formatCurrency(sellingPrice)}/kg</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-[var(--color-text-secondary)]">{t('finance.grossMargin')}</p><p className={cn('text-2xl font-bold', grossMargin >= 20 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]')}>{grossMargin.toFixed(1)}%</p></CardContent></Card>
            </div>

            <div className="flex gap-2 border-b border-[var(--color-border)] pb-0">
                {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[2px] transition-colors', activeTab === tab.id ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)]')}>
                        <tab.icon className="w-4 h-4" />{tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'cogs' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle>{t('finance.cogsCalculator')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div><Label>{t('finance.materialCost')}</Label><Input type="number" value={cogsForm.materialCost} onChange={(e) => setCogsForm({ ...cogsForm, materialCost: Number(e.target.value) })} /></div>
                            <div><Label>{t('finance.electricCost')}</Label><Input type="number" value={cogsForm.electricCost} onChange={(e) => setCogsForm({ ...cogsForm, electricCost: Number(e.target.value) })} /></div>
                            <div><Label>{t('finance.laborCost')}</Label><Input type="number" value={cogsForm.laborCost} onChange={(e) => setCogsForm({ ...cogsForm, laborCost: Number(e.target.value) })} /></div>
                            <div><Label>{t('finance.depreciationCost')}</Label><Input type="number" value={cogsForm.depreciationCost} onChange={(e) => setCogsForm({ ...cogsForm, depreciationCost: Number(e.target.value) })} /></div>
                            <div><Label>Output Qty (kg)</Label><Input type="number" value={cogsForm.outputQty} onChange={(e) => setCogsForm({ ...cogsForm, outputQty: Number(e.target.value) })} /></div>
                            <div className="pt-4 border-t space-y-2">
                                <div className="flex justify-between"><span>{t('finance.totalCogs')}</span><span className="font-bold">{formatCurrency(totalCogs)}</span></div>
                                <div className="flex justify-between"><span>{t('finance.unitCost')}</span><span className="font-bold text-[var(--color-primary)]">{formatCurrency(unitCost)}/kg</span></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Cost Breakdown</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <RechartsPie><Pie data={cogsBreakdown} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">{cogsBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Legend /><Tooltip formatter={(v) => formatCurrency(v)} /></RechartsPie>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === 'margins' && (
                <Card>
                    <CardHeader><CardTitle>Monthly Profit Analysis</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyProfit}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                                <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `${v / 1000000}M`} />
                                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }} />
                                <Legend />
                                <Bar dataKey="revenue" name={t('finance.revenue')} fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="cogs" name="COGS" fill="#F97316" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="profit" name={t('finance.profit')} fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {(activeTab === 'costs' || activeTab === 'revenue') && (
                <Card><CardContent className="p-12 text-center">
                    <FileText className="w-12 h-12 mx-auto text-[var(--color-text-light)] mb-4" />
                    <h3 className="text-lg font-medium">{activeTab === 'costs' ? 'Cost Reports' : 'Revenue Reports'}</h3>
                    <p className="text-[var(--color-text-secondary)] mt-2">Detailed {activeTab} analysis coming soon</p>
                    <Button className="mt-4">Generate Report</Button>
                </CardContent></Card>
            )}
        </div>
    );
};

export default FinancePage;
