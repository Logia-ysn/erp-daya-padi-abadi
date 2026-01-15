import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, MoreHorizontal, Star, Phone, MapPin, FileText, Truck, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, Button, Input, StatusBadge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, ConfirmModal } from '@/components/ui';
import { SupplierForm, PurchaseOrderForm } from '@/components/shared';
import { useCrud, useModal, useConfirm } from '@/hooks';
import { formatCurrency, formatDateShort, cn } from '@/lib/utils';
import { mockSuppliers, mockPurchaseOrders } from '@/services/mockData';

const ProcurementPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('suppliers');
    const [searchTerm, setSearchTerm] = useState('');

    // CRUD hooks
    const suppliers = useCrud('erp_suppliers', mockSuppliers);
    const purchaseOrders = useCrud('erp_purchase_orders', mockPurchaseOrders);

    // Modal states
    const supplierModal = useModal();
    const poModal = useModal();
    const confirmDialog = useConfirm();

    const tabs = [
        { id: 'suppliers', label: t('procurement.suppliers'), icon: MapPin },
        { id: 'purchase-orders', label: t('procurement.purchaseOrders'), icon: FileText },
        { id: 'receiving', label: t('procurement.receiving'), icon: Truck },
    ];

    const filteredSuppliers = suppliers.items.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPOs = purchaseOrders.items.filter(po =>
        po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) || po.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handlers
    const handleSupplierSubmit = async (data) => {
        if (supplierModal.mode === 'edit') {
            await suppliers.update(supplierModal.selectedItem.id, data);
        } else {
            await suppliers.create(data);
        }
        supplierModal.close();
    };

    const handlePOSubmit = async (data) => {
        if (poModal.mode === 'edit') {
            await purchaseOrders.update(poModal.selectedItem.id, data);
        } else {
            await purchaseOrders.create(data);
        }
        poModal.close();
    };

    const handleDelete = async () => {
        if (activeTab === 'suppliers') {
            await suppliers.remove(confirmDialog.itemToDelete.id);
        } else {
            await purchaseOrders.remove(confirmDialog.itemToDelete.id);
        }
        confirmDialog.close();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('procurement.title')}</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Manage suppliers and purchase orders</p>
                </div>
                <Button onClick={() => activeTab === 'suppliers' ? supplierModal.openCreate() : poModal.openCreate()}>
                    <Plus className="w-4 h-4 mr-2" />
                    {activeTab === 'suppliers' ? t('procurement.newSupplier') : t('procurement.newPO')}
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-[var(--color-border)] pb-0">
                {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[2px] transition-colors', activeTab === tab.id ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]')}>
                        <tab.icon className="w-4 h-4" />{tab.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="flex gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
                    <Input placeholder={t('common.search') + '...'} className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Button variant="outline"><Filter className="w-4 h-4 mr-2" />{t('common.filter')}</Button>
            </div>

            {/* Suppliers Tab */}
            {activeTab === 'suppliers' && (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('procurement.supplierCode')}</TableHead>
                                    <TableHead>{t('procurement.supplierName')}</TableHead>
                                    <TableHead>{t('procurement.contactPerson')}</TableHead>
                                    <TableHead>{t('procurement.phone')}</TableHead>
                                    <TableHead>{t('procurement.rating')}</TableHead>
                                    <TableHead>{t('common.status')}</TableHead>
                                    <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSuppliers.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell className="font-medium">{supplier.code}</TableCell>
                                        <TableCell><div><p className="font-medium">{supplier.name}</p><p className="text-xs text-[var(--color-text-secondary)]">{supplier.address}</p></div></TableCell>
                                        <TableCell>{supplier.contact}</TableCell>
                                        <TableCell><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[var(--color-text-light)]" />{supplier.phone}</div></TableCell>
                                        <TableCell><div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /><span>{supplier.rating}</span></div></TableCell>
                                        <TableCell><StatusBadge status={supplier.status} /></TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon-sm" onClick={() => supplierModal.openEdit(supplier)}><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => confirmDialog.openConfirm(supplier)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Purchase Orders Tab */}
            {activeTab === 'purchase-orders' && (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('procurement.poNumber')}</TableHead>
                                    <TableHead>{t('procurement.supplierName')}</TableHead>
                                    <TableHead>{t('procurement.poDate')}</TableHead>
                                    <TableHead>{t('procurement.deliveryDate')}</TableHead>
                                    <TableHead>{t('procurement.material')}</TableHead>
                                    <TableHead className="text-right">{t('procurement.totalAmount')}</TableHead>
                                    <TableHead>{t('common.status')}</TableHead>
                                    <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPOs.map((po) => (
                                    <TableRow key={po.id}>
                                        <TableCell className="font-medium text-[var(--color-primary)]">{po.poNumber}</TableCell>
                                        <TableCell>{po.supplierName}</TableCell>
                                        <TableCell>{formatDateShort(po.date)}</TableCell>
                                        <TableCell>{formatDateShort(po.deliveryDate)}</TableCell>
                                        <TableCell><div><p>{po.items[0]?.material}</p><p className="text-xs text-[var(--color-text-secondary)]">{po.items[0]?.qty} kg @ {po.items[0]?.moistureContent}% MC</p></div></TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(po.totalAmount)}</TableCell>
                                        <TableCell><StatusBadge status={po.status} /></TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon-sm" onClick={() => poModal.openView(po)}><Eye className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => poModal.openEdit(po)}><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => confirmDialog.openConfirm(po)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Receiving Tab */}
            {activeTab === 'receiving' && (
                <Card><CardContent className="p-12 text-center"><Truck className="w-12 h-12 mx-auto text-[var(--color-text-light)] mb-4" /><h3 className="text-lg font-medium text-[var(--color-text-primary)]">Receiving Module</h3><p className="text-[var(--color-text-secondary)] mt-2">Record incoming materials from purchase orders</p><Button className="mt-4"><Plus className="w-4 h-4 mr-2" />New Receiving</Button></CardContent></Card>
            )}

            {/* Modals */}
            <SupplierForm
                isOpen={supplierModal.isOpen}
                onClose={supplierModal.close}
                onSubmit={handleSupplierSubmit}
                initialData={supplierModal.selectedItem}
                mode={supplierModal.mode}
                isLoading={suppliers.isLoading}
            />

            <PurchaseOrderForm
                isOpen={poModal.isOpen}
                onClose={poModal.close}
                onSubmit={handlePOSubmit}
                initialData={poModal.selectedItem}
                mode={poModal.mode}
                isLoading={purchaseOrders.isLoading}
                suppliers={suppliers.items}
            />

            <ConfirmModal
                isOpen={confirmDialog.isOpen}
                onClose={confirmDialog.close}
                onConfirm={handleDelete}
                title="Delete Confirmation"
                message={`Are you sure you want to delete "${confirmDialog.itemToDelete?.name || confirmDialog.itemToDelete?.poNumber}"? This action cannot be undone.`}
                loading={suppliers.isLoading || purchaseOrders.isLoading}
            />
        </div>
    );
};

export default ProcurementPage;
