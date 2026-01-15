import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import { Modal, ModalFooter, Button, Input, Label, Select } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

const SalesOrderForm = ({ isOpen, onClose, onSubmit, initialData, mode, isLoading, customers = [], inventory = [] }) => {
    const { t } = useTranslation();
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const [form, setForm] = useState({
        soNumber: '', customerId: '', customerName: '', type: 'spot', date: '', deliveryDate: '',
        items: [{ product: 'Pellet Biomassa', qty: 0, unit: 'kg', pricePerUnit: 2500 }],
        status: 'pending', paymentStatus: 'unpaid',
    });

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else {
            const today = new Date().toISOString().split('T')[0];
            setForm({
                soNumber: `SO-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
                customerId: '', customerName: '', type: 'spot', date: today, deliveryDate: '',
                items: [{ product: 'Pellet Biomassa', qty: 0, unit: 'kg', pricePerUnit: 2500 }],
                status: 'pending', paymentStatus: 'unpaid',
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const totalAmount = form.items.reduce((sum, item) => sum + (item.qty * item.pricePerUnit), 0);
        onSubmit({ ...form, totalAmount });
    };

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleCustomerChange = (customerId) => {
        const customer = customers.find(c => c.id === customerId);
        setForm(prev => ({ ...prev, customerId, customerName: customer?.name || '' }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...form.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setForm(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => setForm(prev => ({ ...prev, items: [...prev.items, { product: '', qty: 0, unit: 'kg', pricePerUnit: 0 }] }));
    const removeItem = (index) => { if (form.items.length > 1) setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) })); };

    const totalAmount = form.items.reduce((sum, item) => sum + (item.qty * item.pricePerUnit), 0);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Sales Order' : isView ? 'SO Details' : t('sales.newOrder')} size="xl">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div><Label required>{t('sales.soNumber')}</Label><Input value={form.soNumber} onChange={(e) => handleChange('soNumber', e.target.value)} disabled={isView} required /></div>
                    <div><Label required>{t('sales.customerName')}</Label>
                        <Select value={form.customerId} onChange={(e) => handleCustomerChange(e.target.value)} disabled={isView} required>
                            <option value="">-- Select Customer --</option>
                            {customers.filter(c => c.status === 'active').map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                        </Select>
                    </div>
                    <div><Label>Order Type</Label>
                        <Select value={form.type} onChange={(e) => handleChange('type', e.target.value)} disabled={isView}>
                            <option value="spot">Spot Sale</option>
                            <option value="contract">Contract</option>
                        </Select>
                    </div>
                    <div><Label required>{t('sales.orderDate')}</Label><Input type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} disabled={isView} required /></div>
                    <div><Label required>{t('sales.deliveryDate')}</Label><Input type="date" value={form.deliveryDate} onChange={(e) => handleChange('deliveryDate', e.target.value)} disabled={isView} required /></div>
                    <div><Label>{t('common.status')}</Label>
                        <Select value={form.status} onChange={(e) => handleChange('status', e.target.value)} disabled={isView}>
                            <option value="pending">{t('common.pending')}</option>
                            <option value="in_progress">{t('common.in_progress')}</option>
                            <option value="completed">{t('common.completed')}</option>
                            <option value="cancelled">{t('common.cancelled')}</option>
                        </Select>
                    </div>
                </div>

                {/* Items Table */}
                <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 flex justify-between items-center">
                        <span className="font-medium text-sm">Order Items</span>
                        {!isView && (<Button type="button" variant="ghost" size="sm" onClick={addItem}><Plus className="w-4 h-4 mr-1" /> Add Item</Button>)}
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100"><tr><th className="px-4 py-2 text-left">Product</th><th className="px-4 py-2 text-right">Qty (kg)</th><th className="px-4 py-2 text-right">Price/kg</th><th className="px-4 py-2 text-right">Subtotal</th>{!isView && <th className="px-4 py-2 w-10"></th>}</tr></thead>
                        <tbody>
                            {form.items.map((item, idx) => (
                                <tr key={idx} className="border-t border-[var(--color-border)]">
                                    <td className="px-4 py-2">
                                        <Select value={item.product} onChange={(e) => handleItemChange(idx, 'product', e.target.value)} disabled={isView} className="w-full">
                                            <option value="Pellet Biomassa">Pellet Biomassa</option>
                                            <option value="Pellet Premium">Pellet Premium Grade A</option>
                                        </Select>
                                    </td>
                                    <td className="px-4 py-2"><Input type="number" value={item.qty} onChange={(e) => handleItemChange(idx, 'qty', Number(e.target.value))} disabled={isView} className="text-right" /></td>
                                    <td className="px-4 py-2"><Input type="number" value={item.pricePerUnit} onChange={(e) => handleItemChange(idx, 'pricePerUnit', Number(e.target.value))} disabled={isView} className="text-right" /></td>
                                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.qty * item.pricePerUnit)}</td>
                                    {!isView && (<td className="px-2 py-2"><button type="button" onClick={() => removeItem(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></td>)}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t border-[var(--color-border)]">
                            <tr><td colSpan={3} className="px-4 py-3 text-right font-semibold">{t('common.total')}</td><td className="px-4 py-3 text-right font-bold text-lg text-[var(--color-primary)]">{formatCurrency(totalAmount)}</td>{!isView && <td></td>}</tr>
                        </tfoot>
                    </table>
                </div>

                {!isView && (<ModalFooter><Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>{t('common.cancel')}</Button><Button type="submit" loading={isLoading}>{isEdit ? t('common.save') : t('common.add')}</Button></ModalFooter>)}
            </form>
        </Modal>
    );
};

export default SalesOrderForm;
