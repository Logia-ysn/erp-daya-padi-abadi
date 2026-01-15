import { useTranslation } from 'react-i18next';
import { TrendingUp, Box, Factory, Wrench, DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, Button, StatusBadge } from '@/components/ui';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import { mockDashboardMetrics, mockProductionChart, mockSalesChart, mockMachines, mockSalesOrders } from '@/services/mockData';

const DashboardPage = () => {
    const { t } = useTranslation();

    const metrics = [
        { label: t('dashboard.totalRevenue'), value: formatCurrency(mockDashboardMetrics.totalRevenue), change: '+12.5%', trend: 'up', icon: DollarSign, color: 'bg-green-100 text-green-600' },
        { label: t('dashboard.totalProduction'), value: `${formatNumber(mockDashboardMetrics.totalProduction)} kg`, change: '+8.3%', trend: 'up', icon: Factory, color: 'bg-blue-100 text-blue-600' },
        { label: t('dashboard.activeOrders'), value: mockDashboardMetrics.activeOrders, change: '-2%', trend: 'down', icon: Box, color: 'bg-[var(--color-secondary-light)] text-[var(--color-secondary)]' },
        { label: t('dashboard.machineUptime'), value: `${mockDashboardMetrics.machineUptime}%`, change: '+3.2%', trend: 'up', icon: Wrench, color: 'bg-purple-100 text-purple-600' },
    ];

    const runningMachines = mockMachines.filter(m => m.status === 'running').length;
    const maintenanceNeeded = mockMachines.filter(m => m.runningHours / m.maxHours >= 0.9);

    const inventoryData = [
        { name: 'Raw Material', value: 45000, color: '#2D7A4F' },
        { name: 'WIP', value: 12000, color: '#D4A600' },
        { name: 'Finished Goods', value: 28000, color: '#16A085' },
        { name: 'Spareparts', value: 5000, color: '#8B5CF6' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('dashboard.welcome')} 👋</h1><p className="text-[var(--color-text-secondary)] mt-1">{t('dashboard.subtitle')}</p></div>
                <div className="flex gap-3"><Button variant="outline">{t('dashboard.today')}</Button><Button>{t('dashboard.exportReport')}</Button></div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-[var(--color-text-secondary)]">{metric.label}</p>
                                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', metric.color)}><metric.icon className="w-5 h-5" /></div>
                            </div>
                            <p className="text-2xl font-bold mt-2 text-[var(--color-text-primary)]">{metric.value}</p>
                            <div className="flex items-center mt-2 text-sm">
                                {metric.trend === 'up' ? <ArrowUpRight className="w-4 h-4 text-[var(--color-success)]" /> : <ArrowDownRight className="w-4 h-4 text-[var(--color-error)]" />}
                                <span className={metric.trend === 'up' ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}>{metric.change}</span>
                                <span className="text-[var(--color-text-secondary)] ml-1">{t('dashboard.vsLastMonth')}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>{t('dashboard.productionSummary')}</CardTitle><Button variant="ghost" size="sm">{t('common.viewAll')} →</Button></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={mockProductionChart}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                                <YAxis stroke="#94A3B8" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="output" stroke="#2D7A4F" fill="#E8F5EE" strokeWidth={2} name="Output (kg)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>{t('dashboard.salesTrend')}</CardTitle><Button variant="ghost" size="sm">{t('common.viewAll')} →</Button></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={mockSalesChart}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                                <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
                                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }} />
                                <Bar dataKey="revenue" fill="#2D7A4F" radius={[4, 4, 0, 0]} name="Revenue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <Card className="lg:col-span-2"><CardHeader className="flex flex-row items-center justify-between"><CardTitle>{t('dashboard.recentOrders')}</CardTitle><Button variant="ghost" size="sm">{t('common.viewAll')} →</Button></CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-[var(--color-border)]">
                            {mockSalesOrders.slice(0, 4).map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center"><Box className="w-5 h-5 text-[var(--color-primary)]" /></div>
                                        <div><p className="font-medium text-[var(--color-text-primary)]">{order.soNumber}</p><p className="text-sm text-[var(--color-text-secondary)]">{order.customerName}</p></div>
                                    </div>
                                    <div className="text-right"><p className="font-semibold text-[var(--color-text-primary)]">{formatCurrency(order.totalAmount)}</p><StatusBadge status={order.status} /></div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Maintenance Alerts & Inventory */}
                <div className="space-y-6">
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5 text-[var(--color-warning)]" />{t('dashboard.maintenanceAlerts')}</CardTitle></CardHeader>
                        <CardContent>
                            {maintenanceNeeded.length > 0 ? maintenanceNeeded.slice(0, 2).map((machine) => (
                                <div key={machine.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg mb-2">
                                    <div><p className="font-medium text-orange-800">{machine.name}</p><p className="text-sm text-orange-600">{machine.runningHours}/{machine.maxHours} hours</p></div>
                                    <Button variant="outline" size="sm" className="text-orange-600 border-orange-300">{t('maintenance.schedule')}</Button>
                                </div>
                            )) : <p className="text-center text-[var(--color-text-secondary)] py-4">No maintenance alerts</p>}
                        </CardContent>
                    </Card>

                    <Card><CardHeader><CardTitle>{t('dashboard.inventoryStatus')}</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart><Pie data={inventoryData} innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">{inventoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip formatter={(v) => formatNumber(v) + ' kg'} /></PieChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {inventoryData.map((item) => (<div key={item.name} className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-[var(--color-text-secondary)]">{item.name}</span></div>))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
