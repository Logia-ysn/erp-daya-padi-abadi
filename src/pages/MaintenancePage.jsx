import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, Wrench, Clock, AlertTriangle, CheckCircle, Settings, Calendar, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, Button, Input, StatusBadge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, ConfirmModal } from '@/components/ui';
import { MachineForm } from '@/components/shared';
import { useCrud, useModal, useConfirm } from '@/hooks';
import { formatNumber, formatDateShort, formatCurrency, cn } from '@/lib/utils';
import { mockMachines, mockMaintenance } from '@/services/mockData';

const MaintenancePage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('machines');
    const [categoryFilter, setCategoryFilter] = useState('all'); // all, production, supporting
    const [searchTerm, setSearchTerm] = useState('');

    const machines = useCrud('erp_machines', mockMachines);
    const maintenance = useCrud('erp_maintenance', mockMaintenance);
    const machineModal = useModal();
    const confirmDialog = useConfirm();

    const tabs = [
        { id: 'machines', label: t('maintenance.machines'), icon: Settings },
        { id: 'schedule', label: t('maintenance.schedule'), icon: Calendar },
        { id: 'history', label: t('maintenance.history'), icon: Clock },
    ];

    const categoryTabs = [
        { id: 'all', label: 'Semua Mesin' },
        { id: 'production', label: 'Mesin Produksi' },
        { id: 'supporting', label: 'Mesin Support' },
    ];

    // Filter machines by category and search
    const filteredMachines = machines.items.filter(m => {
        const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.code.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getHealthColor = (machine) => { const ratio = machine.runningHours / machine.maxHours; if (ratio >= 0.95) return 'text-[var(--color-error)]'; if (ratio >= 0.8) return 'text-[var(--color-warning)]'; return 'text-[var(--color-success)]'; };
    const getHealthBar = (machine) => { const ratio = (machine.runningHours / machine.maxHours) * 100; const color = ratio >= 95 ? 'bg-[var(--color-error)]' : ratio >= 80 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-success)]'; return (<div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden"><div className={cn('h-full transition-all', color)} style={{ width: `${Math.min(ratio, 100)}%` }} /></div>); };

    // Statistics
    const productionMachines = machines.items.filter(m => m.category === 'production');
    const supportMachines = machines.items.filter(m => m.category === 'supporting');
    const runningMachines = machines.items.filter(m => m.status === 'running').length;
    const maintenanceMachines = machines.items.filter(m => m.status === 'maintenance').length;

    const handleSubmit = async (data) => { if (machineModal.mode === 'edit') await machines.update(machineModal.selectedItem.id, data); else await machines.create(data); machineModal.close(); };
    const handleDelete = async () => { await machines.remove(confirmDialog.itemToDelete.id); confirmDialog.close(); };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('maintenance.title')}</h1><p className="text-[var(--color-text-secondary)] mt-1">Kelola mesin produksi dan mesin support</p></div>
                <Button onClick={() => machineModal.openCreate()}><Plus className="w-4 h-4 mr-2" />Tambah Mesin</Button>
            </div>

            {/* Category Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-emerald-500"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><Settings className="w-5 h-5 text-emerald-600" /></div><div><p className="text-sm text-[var(--color-text-secondary)]">Mesin Produksi</p><p className="text-xl font-bold text-emerald-600">{productionMachines.length} unit</p></div></div></CardContent></Card>
                <Card className="border-l-4 border-l-slate-500"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center"><Wrench className="w-5 h-5 text-slate-600" /></div><div><p className="text-sm text-[var(--color-text-secondary)]">Mesin Support</p><p className="text-xl font-bold text-slate-600">{supportMachines.length} unit</p></div></div></CardContent></Card>
                <Card className="border-l-4 border-l-green-500"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600" /></div><div><p className="text-sm text-[var(--color-text-secondary)]">Sedang Berjalan</p><p className="text-xl font-bold text-[var(--color-success)]">{runningMachines} mesin</p></div></div></CardContent></Card>
                <Card className="border-l-4 border-l-orange-500"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-orange-600" /></div><div><p className="text-sm text-[var(--color-text-secondary)]">Dalam Perawatan</p><p className="text-xl font-bold text-[var(--color-warning)]">{maintenanceMachines} mesin</p></div></div></CardContent></Card>
            </div>

            {/* Main Tabs */}
            <div className="flex gap-2 border-b border-[var(--color-border)] pb-0">
                {tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[2px] transition-colors', activeTab === tab.id ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)]')}><tab.icon className="w-4 h-4" />{tab.label}</button>))}
            </div>

            {activeTab === 'machines' && (
                <>
                    {/* Category Filter Tabs */}
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                            {categoryTabs.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategoryFilter(cat.id)}
                                    className={cn(
                                        'px-4 py-2 text-sm font-medium rounded-md transition-all',
                                        categoryFilter === cat.id
                                            ? 'bg-white text-[var(--color-primary)] shadow-sm'
                                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                    )}
                                >
                                    {cat.label}
                                    <span className={cn(
                                        'ml-2 px-1.5 py-0.5 text-xs rounded-full',
                                        categoryFilter === cat.id ? 'bg-[var(--color-primary)] text-white' : 'bg-slate-200'
                                    )}>
                                        {cat.id === 'all' ? machines.items.length : machines.items.filter(m => m.category === cat.id).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
                            <Input placeholder="Cari mesin..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>

                    {/* Machine Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredMachines.map((machine) => (
                            <Card key={machine.id} className={cn(
                                'hover:shadow-lg transition-shadow border-l-4',
                                machine.category === 'production' ? 'border-l-emerald-500' : 'border-l-slate-400'
                            )}>
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-[var(--color-text-primary)]">{machine.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm text-[var(--color-text-secondary)]">{machine.model}</span>
                                                <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium border',
                                                    machine.category === 'production'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-slate-50 text-slate-700 border-slate-200'
                                                )}>
                                                    {machine.category === 'production' ? '⚙️ Produksi' : '🔧 Support'}
                                                </span>
                                            </div>
                                        </div>
                                        <StatusBadge status={machine.status} />
                                    </div>
                                    <div className="space-y-3">
                                        <div><div className="flex justify-between text-sm mb-1"><span className="text-[var(--color-text-secondary)]">{t('maintenance.runningHours')}</span><span className={cn('font-medium', getHealthColor(machine))}>{formatNumber(machine.runningHours)} / {formatNumber(machine.maxHours)} hrs</span></div>{getHealthBar(machine)}</div>
                                        <div className="flex justify-between text-sm"><span className="text-[var(--color-text-secondary)]">{t('maintenance.lastMaintenance')}</span><span>{formatDateShort(machine.lastMaintenance)}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-[var(--color-text-secondary)]">{t('maintenance.nextMaintenance')}</span><span className="font-medium">{formatDateShort(machine.nextMaintenance)}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-[var(--color-text-secondary)]">{t('production.operator')}</span><span>{machine.operator}</span></div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => machineModal.openEdit(machine)}><Edit className="w-4 h-4 mr-1" />Edit</Button>
                                        <Button variant="ghost" size="sm" onClick={() => confirmDialog.openConfirm(machine)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredMachines.length === 0 && (
                        <Card><CardContent className="p-12 text-center">
                            <Settings className="w-12 h-12 mx-auto text-[var(--color-text-light)] mb-4" />
                            <h3 className="text-lg font-medium">Tidak ada mesin ditemukan</h3>
                            <p className="text-[var(--color-text-secondary)] mt-1">Coba ubah filter atau kata kunci pencarian</p>
                        </CardContent></Card>
                    )}
                </>
            )}

            {activeTab === 'history' && (
                <Card><CardContent className="p-0">
                    <Table><TableHeader><TableRow><TableHead>{t('common.date')}</TableHead><TableHead>{t('maintenance.machineName')}</TableHead><TableHead>{t('maintenance.maintenanceType')}</TableHead><TableHead>{t('common.description')}</TableHead><TableHead>{t('maintenance.technician')}</TableHead><TableHead className="text-right">Cost</TableHead><TableHead>{t('common.status')}</TableHead></TableRow></TableHeader>
                        <TableBody>{maintenance.items.map((mnt) => (<TableRow key={mnt.id}><TableCell>{formatDateShort(mnt.date)}</TableCell><TableCell className="font-medium">{mnt.machineName}</TableCell><TableCell><span className={cn('px-2 py-1 rounded-full text-xs font-medium', mnt.type === 'preventive' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800')}>{mnt.type === 'preventive' ? t('maintenance.preventive') : t('maintenance.corrective')}</span></TableCell><TableCell>{mnt.description}</TableCell><TableCell>{mnt.technician}</TableCell><TableCell className="text-right font-medium">{formatCurrency(mnt.cost)}</TableCell><TableCell><StatusBadge status={mnt.status} /></TableCell></TableRow>))}</TableBody>
                    </Table>
                </CardContent></Card>
            )}

            {activeTab === 'schedule' && (<Card><CardContent className="p-12 text-center"><Calendar className="w-12 h-12 mx-auto text-[var(--color-text-light)] mb-4" /><h3 className="text-lg font-medium">Jadwal Perawatan</h3><Button className="mt-4"><Plus className="w-4 h-4 mr-2" />Tambah Jadwal</Button></CardContent></Card>)}

            <MachineForm isOpen={machineModal.isOpen} onClose={machineModal.close} onSubmit={handleSubmit} initialData={machineModal.selectedItem} mode={machineModal.mode} isLoading={machines.isLoading} />
            <ConfirmModal isOpen={confirmDialog.isOpen} onClose={confirmDialog.close} onConfirm={handleDelete} title="Hapus Mesin" message={`Hapus "${confirmDialog.itemToDelete?.name}"?`} loading={machines.isLoading} />
        </div>
    );
};

export default MaintenancePage;
