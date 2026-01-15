import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, Users, FileText, Truck, Receipt, Building, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, Button, Input, StatusBadge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, ConfirmModal } from '@/components/ui';
import { CustomerForm, SalesOrderForm } from '@/components/shared';
import { useCrud, useModal, useConfirm } from '@/hooks';
import { formatCurrency, formatDateShort, cn } from '@/lib/utils';
import { mockCustomers, mockSalesOrders } from '@/services/mockData';

const SalesPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('customers');
    const [searchTerm, setSearchTerm] = useState('');

    const customers = useCrud('erp_customers', mockCustomers);
    const salesOrders = useCrud('erp_sales_orders', mockSalesOrders);
    const customerModal = useModal();
    const soModal = useModal();
    const confirmDialog = useConfirm();
    const [deleteType, setDeleteType] = useState('customer');

    const tabs = [
        { id: 'customers', label: t('sales.customers'), icon: Users },
        { id: 'sales-orders', label: t('sales.salesOrders'), icon: FileText },
        { id: 'deliveries', label: t('sales.deliveries'), icon: Truck },
        { id: 'invoices', label: t('sales.invoices'), icon: Receipt },
    ];

    const filteredCustomers = customers.items.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredOrders = salesOrders.items.filter(so => so.soNumber.toLowerCase().includes(searchTerm.toLowerCase()) || so.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalRevenue = salesOrders.items.filter(so => so.status === 'completed').reduce((sum, so) => sum + so.totalAmount, 0);

    const getTypeColor = (type) => ({ pltu: 'bg-blue-100 text-blue-800', industry: 'bg-purple-100 text-purple-800', end_customer: 'bg-green-100 text-green-800' }[type] || 'bg-gray-100 text-gray-800');

    const handleCustomerSubmit = async (data) => { if (customerModal.mode === 'edit') await customers.update(customerModal.selectedItem.id, data); else await customers.create(data); customerModal.close(); };
    const handleSOSubmit = async (data) => { if (soModal.mode === 'edit') await salesOrders.update(soModal.selectedItem.id, data); else await salesOrders.create(data); soModal.close(); };

    const openDeleteConfirm = (item, type) => { setDeleteType(type); confirmDialog.openConfirm(item); };
    const handleDelete = async () => {
        if (deleteType === 'customer') await customers.remove(confirmDialog.itemToDelete.id);
        else await salesOrders.remove(confirmDialog.itemToDelete.id);
        confirmDialog.close();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('sales.title')}</h1><p className="text-[var(--color-text-secondary)] mt-1">Manage customers, sales orders, and deliveries</p></div>
                <Button onClick={() => activeTab === 'customers' ? customerModal.openCreate() : soModal.openCreate()}>
                    <Plus className="w-4 h-4 mr-2" />{activeTab === 'customers' ? t('sales.newCustomer') : t('sales.newOrder')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4"><p className="text-sm text-[var(--color-text-secondary)]">Total Revenue</p><p className="text-2xl font-bold text-[var(--color-success)]">{formatCurrency(totalRevenue)}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-[var(--color-text-secondary)]">Active Customers</p><p className="text-2xl font-bold">{customers.items.filter(c => c.status === 'active').length}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-[var(--color-text-secondary)]">Contract Orders</p><p className="text-2xl font-bold text-[var(--color-primary)]">{salesOrders.items.filter(so => so.type === 'contract').length}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-[var(--color-text-secondary)]">Pending Orders</p><p className="text-2xl font-bold text-[var(--color-warning)]">{salesOrders.items.filter(so => so.status === 'pending').length}</p></CardContent></Card>
            </div>

            <div className="flex gap-2 border-b border-[var(--color-border)] pb-0 overflow-x-auto">
                {tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[2px] transition-colors whitespace-nowrap', activeTab === tab.id ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)]')}><tab.icon className="w-4 h-4" />{tab.label}</button>))}
            </div>

            <div className="flex gap-3"><div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" /><Input placeholder={t('common.search') + '...'} className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div><Button variant="outline"><Filter className="w-4 h-4 mr-2" />{t('common.filter')}</Button></div>

            {activeTab === 'customers' && (
                <Card><CardContent className="p-0">
                    <Table><TableHeader><TableRow><TableHead>{t('sales.customerCode')}</TableHead><TableHead>{t('sales.customerName')}</TableHead><TableHead>{t('sales.customerType')}</TableHead><TableHead>{t('sales.paymentTerms')}</TableHead><TableHead>{t('common.status')}</TableHead><TableHead className="w-[100px]">{t('common.actions')}</TableHead></TableRow></TableHeader>
                        <TableBody>{filteredCustomers.map((customer) => (<TableRow key={customer.id}><TableCell className="font-medium">{customer.code}</TableCell><TableCell><div className="flex items-center gap-2"><Building className="w-4 h-4 text-[var(--color-text-light)]" /><div><p className="font-medium">{customer.name}</p><p className="text-xs text-[var(--color-text-secondary)]">{customer.address}</p></div></div></TableCell><TableCell><span className={cn('px-2 py-1 rounded-full text-xs font-medium', getTypeColor(customer.type))}>{customer.type}</span></TableCell><TableCell>{customer.paymentTerms} days</TableCell><TableCell><StatusBadge status={customer.status} /></TableCell><TableCell><div className="flex items-center gap-1"><Button variant="ghost" size="icon-sm" onClick={() => customerModal.openEdit(customer)}><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="icon-sm" onClick={() => openDeleteConfirm(customer, 'customer')}><Trash2 className="w-4 h-4 text-red-500" /></Button></div></TableCell></TableRow>))}</TableBody>
                    </Table>
                </CardContent></Card>
            )}

            {activeTab === 'sales-orders' && (
                <Card><CardContent className="p-0">
                    <Table><TableHeader><TableRow><TableHead>{t('sales.soNumber')}</TableHead><TableHead>{t('sales.customerName')}</TableHead><TableHead>Type</TableHead><TableHead>{t('sales.orderDate')}</TableHead><TableHead className="text-right">{t('common.total')}</TableHead><TableHead>{t('common.status')}</TableHead><TableHead className="w-[120px]">{t('common.actions')}</TableHead></TableRow></TableHeader>
                        <TableBody>{filteredOrders.map((order) => (<TableRow key={order.id}><TableCell className="font-medium text-[var(--color-primary)]">{order.soNumber}</TableCell><TableCell>{order.customerName}</TableCell><TableCell><span className={cn('px-2 py-1 rounded-full text-xs font-medium', order.type === 'contract' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800')}>{order.type}</span></TableCell><TableCell>{formatDateShort(order.date)}</TableCell><TableCell className="text-right font-medium">{formatCurrency(order.totalAmount)}</TableCell><TableCell><StatusBadge status={order.status} /></TableCell><TableCell><div className="flex items-center gap-1"><Button variant="ghost" size="icon-sm" onClick={() => soModal.openView(order)}><Eye className="w-4 h-4" /></Button><Button variant="ghost" size="icon-sm" onClick={() => soModal.openEdit(order)}><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="icon-sm" onClick={() => openDeleteConfirm(order, 'so')}><Trash2 className="w-4 h-4 text-red-500" /></Button></div></TableCell></TableRow>))}</TableBody>
                    </Table>
                </CardContent></Card>
            )}

            {(activeTab === 'deliveries' || activeTab === 'invoices') && (
                <Card><CardContent className="p-12 text-center">{activeTab === 'deliveries' ? <Truck className="w-12 h-12 mx-auto text-[var(--color-text-light)] mb-4" /> : <Receipt className="w-12 h-12 mx-auto text-[var(--color-text-light)] mb-4" />}<h3 className="text-lg font-medium">{activeTab === 'deliveries' ? 'Delivery Management' : 'Invoice Management'}</h3><Button className="mt-4"><Plus className="w-4 h-4 mr-2" />Create New</Button></CardContent></Card>
            )}

            <CustomerForm isOpen={customerModal.isOpen} onClose={customerModal.close} onSubmit={handleCustomerSubmit} initialData={customerModal.selectedItem} mode={customerModal.mode} isLoading={customers.isLoading} />
            <SalesOrderForm isOpen={soModal.isOpen} onClose={soModal.close} onSubmit={handleSOSubmit} initialData={soModal.selectedItem} mode={soModal.mode} isLoading={salesOrders.isLoading} customers={customers.items} />
            <ConfirmModal isOpen={confirmDialog.isOpen} onClose={confirmDialog.close} onConfirm={handleDelete} title="Delete Confirmation" message={`Delete "${confirmDialog.itemToDelete?.name || confirmDialog.itemToDelete?.soNumber}"?`} loading={customers.isLoading || salesOrders.isLoading} />
        </div>
    );
};

export default SalesPage;
