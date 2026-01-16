import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, Package, Warehouse, ArrowUpRight, ArrowDownRight, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, Button, Input, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, ConfirmModal } from '@/components/ui';
import { InventoryForm } from '@/components/shared';
import { useModal, useConfirm } from '@/hooks';
import { useFactoryCrud } from '@/hooks/useFactoryCrud';
import { formatNumber, formatCurrency, cn } from '@/lib/utils';
import { mockInventory } from '@/services/mockData';

const InventoryPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Use factory-aware CRUD - data filtered by active factory
    const inventory = useFactoryCrud('erp_inventory', mockInventory);
    const itemModal = useModal();
    const confirmDialog = useConfirm();

    const tabs = [
        { id: 'all', label: t('common.all'), count: inventory.items.length },
        { id: 'raw', label: t('inventory.rawMaterials'), count: inventory.items.filter(i => i.type === 'raw').length },
        { id: 'wip', label: t('inventory.wip'), count: inventory.items.filter(i => i.type === 'wip').length },
        { id: 'finished', label: t('inventory.finishedGoods'), count: inventory.items.filter(i => i.type === 'finished').length },
        { id: 'sparepart', label: t('inventory.spareparts'), count: inventory.items.filter(i => i.type === 'sparepart').length },
    ];

    const filteredInventory = inventory.items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' || item.type === activeTab;
        return matchesSearch && matchesTab;
    });

    const lowStockItems = inventory.items.filter(item => item.currentStock <= item.minStock);
    const totalValue = inventory.items.reduce((sum, item) => sum + (item.currentStock * item.pricePerUnit), 0);

    const getTypeColor = (type) => ({ raw: 'bg-blue-100 text-blue-800', wip: 'bg-orange-100 text-orange-800', finished: 'bg-green-100 text-green-800', sparepart: 'bg-purple-100 text-purple-800' }[type] || 'bg-gray-100 text-gray-800');
    const getTypeLabel = (type) => ({ raw: 'Raw Material', wip: 'WIP', finished: 'Finished Good', sparepart: 'Sparepart' }[type] || type);

    const handleSubmit = async (data) => {
        if (itemModal.mode === 'edit') await inventory.update(itemModal.selectedItem.id, data);
        else await inventory.create(data);
        itemModal.close();
    };

    const handleDelete = async () => { await inventory.remove(confirmDialog.itemToDelete.id); confirmDialog.close(); };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('inventory.title')}</h1><p className="text-[var(--color-text-secondary)] mt-1">Track stock levels across all warehouses</p></div>
                <div className="flex gap-3">
                    <Button variant="outline"><ArrowDownRight className="w-4 h-4 mr-2" />{t('inventory.stockIn')}</Button>
                    <Button variant="outline"><ArrowUpRight className="w-4 h-4 mr-2" />{t('inventory.stockOut')}</Button>
                    <Button onClick={() => itemModal.openCreate()}><Plus className="w-4 h-4 mr-2" />Add Item</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Package className="w-5 h-5 text-blue-600" /></div><div><p className="text-sm text-[var(--color-text-secondary)]">Total Items</p><p className="text-xl font-bold">{inventory.items.length}</p></div></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Warehouse className="w-5 h-5 text-green-600" /></div><div><p className="text-sm text-[var(--color-text-secondary)]">Total Value</p><p className="text-xl font-bold">{formatCurrency(totalValue)}</p></div></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-orange-600" /></div><div><p className="text-sm text-[var(--color-text-secondary)]">{t('inventory.lowStockAlert')}</p><p className="text-xl font-bold text-[var(--color-warning)]">{lowStockItems.length} items</p></div></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><Package className="w-5 h-5 text-purple-600" /></div><div><p className="text-sm text-[var(--color-text-secondary)]">Categories</p><p className="text-xl font-bold">4</p></div></div></CardContent></Card>
            </div>

            <div className="flex gap-2 border-b border-[var(--color-border)] pb-0 overflow-x-auto">
                {tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[2px] transition-colors whitespace-nowrap', activeTab === tab.id ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)]')}>{tab.label}<span className={cn('px-2 py-0.5 rounded-full text-xs', activeTab === tab.id ? 'bg-[var(--color-primary)] text-white' : 'bg-slate-100')}>{tab.count}</span></button>))}
            </div>

            <div className="flex gap-3"><div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" /><Input placeholder={t('common.search') + '...'} className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div><Button variant="outline"><Filter className="w-4 h-4 mr-2" />{t('common.filter')}</Button></div>

            <Card><CardContent className="p-0">
                <Table><TableHeader><TableRow><TableHead>{t('inventory.itemCode')}</TableHead><TableHead>{t('inventory.itemName')}</TableHead><TableHead>{t('common.type')}</TableHead><TableHead className="text-right">{t('inventory.currentStock')}</TableHead><TableHead className="text-right">{t('inventory.minStock')}</TableHead><TableHead>{t('inventory.location')}</TableHead><TableHead className="text-right">Value</TableHead><TableHead className="w-[100px]">{t('common.actions')}</TableHead></TableRow></TableHeader>
                    <TableBody>{filteredInventory.map((item) => {
                        const isLowStock = item.currentStock <= item.minStock; return (
                            <TableRow key={item.id} className={isLowStock ? 'bg-red-50' : ''}>
                                <TableCell className="font-medium">{item.code}</TableCell>
                                <TableCell><div className="flex items-center gap-2">{item.name}{isLowStock && <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />}</div></TableCell>
                                <TableCell><span className={cn('px-2 py-1 rounded-full text-xs font-medium', getTypeColor(item.type))}>{getTypeLabel(item.type)}</span></TableCell>
                                <TableCell className="text-right font-medium">{formatNumber(item.currentStock)} {item.unit}</TableCell>
                                <TableCell className="text-right text-[var(--color-text-secondary)]">{formatNumber(item.minStock)} {item.unit}</TableCell>
                                <TableCell>{item.location}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.currentStock * item.pricePerUnit)}</TableCell>
                                <TableCell><div className="flex items-center gap-1"><Button variant="ghost" size="icon-sm" onClick={() => itemModal.openEdit(item)}><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="icon-sm" onClick={() => confirmDialog.openConfirm(item)}><Trash2 className="w-4 h-4 text-red-500" /></Button></div></TableCell>
                            </TableRow>
                        );
                    })}</TableBody>
                </Table>
            </CardContent></Card>

            <InventoryForm isOpen={itemModal.isOpen} onClose={itemModal.close} onSubmit={handleSubmit} initialData={itemModal.selectedItem} mode={itemModal.mode} isLoading={inventory.isLoading} />
            <ConfirmModal isOpen={confirmDialog.isOpen} onClose={confirmDialog.close} onConfirm={handleDelete} title="Delete Item" message={`Delete "${confirmDialog.itemToDelete?.name}"?`} loading={inventory.isLoading} />
        </div>
    );
};

export default InventoryPage;
