import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, Factory, Gauge, TrendingUp, Clock, FileText, Package, Edit, Trash2, Eye } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, StatusBadge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, ConfirmModal } from '@/components/ui';
import { ProductionForm } from '@/components/shared';
import { useCrud, useModal, useConfirm } from '@/hooks';
import { formatNumber, formatDateShort, cn } from '@/lib/utils';
import { mockProduction, mockMachines } from '@/services/mockData';

const ProductionPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('work-orders');
    const [searchTerm, setSearchTerm] = useState('');

    const production = useCrud('erp_production', mockProduction);
    const machines = useCrud('erp_machines', mockMachines);
    const productionModal = useModal();
    const confirmDialog = useConfirm();

    const tabs = [
        { id: 'work-orders', label: t('production.workOrders'), icon: FileText },
        { id: 'pelletizing', label: t('production.pelletizing'), icon: Factory },
        { id: 'packing', label: t('production.packing'), icon: Package },
    ];

    const filteredProduction = production.items.filter(p => p.woNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const dailyOutput = [
        { day: 'Sen', output: 2100, target: 2000 }, { day: 'Sel', output: 2350, target: 2000 },
        { day: 'Rab', output: 1980, target: 2000 }, { day: 'Kam', output: 2200, target: 2000 },
        { day: 'Jum', output: 2400, target: 2000 }, { day: 'Sab', output: 1800, target: 2000 },
        { day: 'Min', output: 2340, target: 2000 },
    ];

    const totalInput = production.items.reduce((sum, p) => sum + p.inputQty, 0);
    const totalOutput = production.items.reduce((sum, p) => sum + p.outputQty, 0);
    const avgYield = totalInput > 0 ? ((totalOutput / totalInput) * 100).toFixed(1) : 0;

    const handleSubmit = async (data) => {
        if (productionModal.mode === 'edit') await production.update(productionModal.selectedItem.id, data);
        else await production.create(data);
        productionModal.close();
    };

    const handleDelete = async () => { await production.remove(confirmDialog.itemToDelete.id); confirmDialog.close(); };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('production.title')}</h1><p className="text-[var(--color-text-secondary)] mt-1">Track pelletizing process and output quality</p></div>
                <Button onClick={() => productionModal.openCreate()}><Plus className="w-4 h-4 mr-2" />{t('production.newWorkOrder')}</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Factory className="w-5 h-5 text-blue-600" /></div><div><p className="text-sm text-[var(--color-text-secondary)]">{t('production.totalInput')}</p><p className="text-xl font-bold">{formatNumber(totalInput)} kg</p></div></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Package className="w-5 h-5 text-green-600" /></div><div><p className="text-sm text-[var(--color-text-secondary)]">{t('production.totalOutput')}</p><p className="text-xl font-bold text-[var(--color-success)]">{formatNumber(totalOutput)} kg</p></div></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-[var(--color-secondary-light)] flex items-center justify-center"><Gauge className="w-5 h-5 text-[var(--color-secondary)]" /></div><div><p className="text-sm text-[var(--color-text-secondary)]">{t('production.avgYield')}</p><p className={cn('text-xl font-bold', avgYield >= 85 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]')}>{avgYield}%</p></div></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><Clock className="w-5 h-5 text-purple-600" /></div><div><p className="text-sm text-[var(--color-text-secondary)]">{t('production.activeOrders')}</p><p className="text-xl font-bold">{production.items.filter(p => p.status === 'in_progress').length}</p></div></div></CardContent></Card>
            </div>

            <Card><CardHeader><CardTitle>{t('production.dailyOutput')}</CardTitle></CardHeader><CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={dailyOutput}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                        <YAxis stroke="#94A3B8" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="target" stroke="#94A3B8" fill="#F1F5F9" strokeDasharray="5 5" name="Target" />
                        <Area type="monotone" dataKey="output" stroke="var(--color-primary)" fill="var(--color-primary-light)" name="Output (kg)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent></Card>

            <div className="flex gap-2 border-b border-[var(--color-border)] pb-0">
                {tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[2px] transition-colors', activeTab === tab.id ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)]')}><tab.icon className="w-4 h-4" />{tab.label}</button>))}
            </div>

            <div className="flex gap-3"><div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" /><Input placeholder={t('common.search') + '...'} className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div><Button variant="outline"><Filter className="w-4 h-4 mr-2" />{t('common.filter')}</Button></div>

            {activeTab === 'work-orders' && (
                <Card><CardContent className="p-0">
                    <Table><TableHeader><TableRow><TableHead>{t('production.woNumber')}</TableHead><TableHead>{t('common.date')}</TableHead><TableHead>{t('production.machine')}</TableHead><TableHead className="text-right">{t('production.inputQty')}</TableHead><TableHead className="text-right">{t('production.outputQty')}</TableHead><TableHead className="text-right">{t('production.yieldRate')}</TableHead><TableHead>{t('common.status')}</TableHead><TableHead className="w-[120px]">{t('common.actions')}</TableHead></TableRow></TableHeader>
                        <TableBody>{filteredProduction.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell className="font-medium text-[var(--color-primary)]">{record.woNumber}</TableCell>
                                <TableCell>{formatDateShort(record.date)}</TableCell>
                                <TableCell><div><p className="font-medium">{record.machineName}</p><p className="text-xs text-[var(--color-text-secondary)]">Shift {record.shift} • {record.operator}</p></div></TableCell>
                                <TableCell className="text-right">{formatNumber(record.inputQty)} kg</TableCell>
                                <TableCell className="text-right font-medium">{formatNumber(record.outputQty)} kg</TableCell>
                                <TableCell className="text-right"><span className={cn('font-bold', record.yieldRate >= 85 ? 'text-[var(--color-success)]' : record.yieldRate >= 75 ? 'text-[var(--color-warning)]' : 'text-[var(--color-error)]')}>{record.yieldRate}%</span></TableCell>
                                <TableCell><StatusBadge status={record.status} /></TableCell>
                                <TableCell><div className="flex items-center gap-1"><Button variant="ghost" size="icon-sm" onClick={() => productionModal.openView(record)}><Eye className="w-4 h-4" /></Button><Button variant="ghost" size="icon-sm" onClick={() => productionModal.openEdit(record)}><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="icon-sm" onClick={() => confirmDialog.openConfirm(record)}><Trash2 className="w-4 h-4 text-red-500" /></Button></div></TableCell>
                            </TableRow>
                        ))}</TableBody>
                    </Table>
                </CardContent></Card>
            )}

            {(activeTab === 'pelletizing' || activeTab === 'packing') && (
                <Card><CardContent className="p-12 text-center">{activeTab === 'pelletizing' ? <Factory className="w-12 h-12 mx-auto text-[var(--color-text-light)] mb-4" /> : <Package className="w-12 h-12 mx-auto text-[var(--color-text-light)] mb-4" />}<h3 className="text-lg font-medium">{activeTab === 'pelletizing' ? 'Pelletizing Station' : 'Packing Station'}</h3><p className="text-[var(--color-text-secondary)] mt-2">Real-time monitoring coming soon</p></CardContent></Card>
            )}

            <ProductionForm isOpen={productionModal.isOpen} onClose={productionModal.close} onSubmit={handleSubmit} initialData={productionModal.selectedItem} mode={productionModal.mode} isLoading={production.isLoading} machines={machines.items} />
            <ConfirmModal isOpen={confirmDialog.isOpen} onClose={confirmDialog.close} onConfirm={handleDelete} title="Delete Work Order" message={`Delete "${confirmDialog.itemToDelete?.woNumber}"?`} loading={production.isLoading} />
        </div>
    );
};

export default ProductionPage;
