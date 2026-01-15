import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import { Modal, ModalFooter, Button, Input, Label, Select } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

const PurchaseOrderForm = ({ isOpen, onClose, onSubmit, initialData, mode, isLoading, suppliers = [] }) => {
    const { t } = useTranslation();
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const [form, setForm] = useState({
        poNumber: '',
        supplierId: '',
        supplierName: '',
        date: '',
        deliveryDate: '',
        items: [{ material: 'Sekam Padi Basah', qty: 0, unit: 'kg', moistureContent: 20, pricePerKg: 0 }],
        status: 'pending',
    });

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else {
            const today = new Date().toISOString().split('T')[0];
            setForm({
                poNumber: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
                supplierId: '',
                supplierName: '',
                date: today,
                deliveryDate: '',
                items: [{ material: 'Sekam Padi Basah', qty: 0, unit: 'kg', moistureContent: 20, pricePerKg: 0 }],
                status: 'pending',
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const totalAmount = form.items.reduce((sum, item) => sum + (item.qty * item.pricePerKg), 0);
        onSubmit({ ...form, totalAmount });
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSupplierChange = (supplierId) => {
        const supplier = suppliers.find(s => s.id === supplierId);
        setForm(prev => ({
            ...prev,
            supplierId,
            supplierName: supplier?.name || ''
        }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...form.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setForm(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setForm(prev => ({
            ...prev,
            items: [...prev.items, { material: '', qty: 0, unit: 'kg', moistureContent: 20, pricePerKg: 0 }]
        }));
    };

    const removeItem = (index) => {
        if (form.items.length > 1) {
            setForm(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };

    const totalAmount = form.items.reduce((sum, item) => sum + (item.qty * item.pricePerKg), 0);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Purchase Order' : isView ? 'PO Details' : t('procurement.newPO')}
            size="xl"
        >
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <Label required>{t('procurement.poNumber')}</Label>
                        <Input value={form.poNumber} onChange={(e) => handleChange('poNumber', e.target.value)} disabled={isView} required />
                    </div>
                    <div>
                        <Label required>{t('procurement.supplierName')}</Label>
                        <Select value={form.supplierId} onChange={(e) => handleSupplierChange(e.target.value)} disabled={isView} required>
                            <option value="">-- Select Supplier --</option>
                            {suppliers.filter(s => s.status === 'active').map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label>{t('common.status')}</Label>
                        <Select value={form.status} onChange={(e) => handleChange('status', e.target.value)} disabled={isView}>
                            <option value="pending">{t('common.pending')}</option>
                            <option value="in_transit">In Transit</option>
                            <option value="completed">{t('common.completed')}</option>
                            <option value="cancelled">{t('common.cancelled')}</option>
                        </Select>
                    </div>
                    <div>
                        <Label required>{t('procurement.poDate')}</Label>
                        <Input type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} disabled={isView} required />
                    </div>
                    <div>
                        <Label required>{t('procurement.deliveryDate')}</Label>
                        <Input type="date" value={form.deliveryDate} onChange={(e) => handleChange('deliveryDate', e.target.value)} disabled={isView} required />
                    </div>
                </div>

                {/* Items */}
                <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 flex justify-between items-center">
                        <span className="font-medium text-sm">Items</span>
                        {!isView && (
                            <Button type="button" variant="ghost" size="sm" onClick={addItem}>
                                <Plus className="w-4 h-4 mr-1" /> Add Item
                            </Button>
                        )}
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="px-4 py-2 text-left">{t('procurement.material')}</th>
                                <th className="px-4 py-2 text-right">{t('procurement.weightKg')}</th>
                                <th className="px-4 py-2 text-right">{t('procurement.moistureContent')}</th>
                                <th className="px-4 py-2 text-right">{t('procurement.pricePerKg')}</th>
                                <th className="px-4 py-2 text-right">{t('procurement.subtotal')}</th>
                                {!isView && <th className="px-4 py-2 w-10"></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {form.items.map((item, idx) => (
                                <tr key={idx} className="border-t border-[var(--color-border)]">
                                    <td className="px-4 py-2">
                                        <Select value={item.material} onChange={(e) => handleItemChange(idx, 'material', e.target.value)} disabled={isView} className="w-full">
                                            <option value="Sekam Padi Basah">Sekam Padi Basah</option>
                                            <option value="Sekam Padi Kering">Sekam Padi Kering</option>
                                        </Select>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Input type="number" value={item.qty} onChange={(e) => handleItemChange(idx, 'qty', Number(e.target.value))} disabled={isView} className="text-right" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-1">
                                            <Input type="number" value={item.moistureContent} onChange={(e) => handleItemChange(idx, 'moistureContent', Number(e.target.value))} disabled={isView} className="text-right" />
                                            <span>%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Input type="number" value={item.pricePerKg} onChange={(e) => handleItemChange(idx, 'pricePerKg', Number(e.target.value))} disabled={isView} className="text-right" />
                                    </td>
                                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.qty * item.pricePerKg)}</td>
                                    {!isView && (
                                        <td className="px-2 py-2">
                                            <button type="button" onClick={() => removeItem(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t border-[var(--color-border)]">
                            <tr>
                                <td colSpan={4} className="px-4 py-3 text-right font-semibold">{t('procurement.totalAmount')}</td>
                                <td className="px-4 py-3 text-right font-bold text-lg text-[var(--color-primary)]">{formatCurrency(totalAmount)}</td>
                                {!isView && <td></td>}
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {!isView && (
                    <ModalFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>{t('common.cancel')}</Button>
                        <Button type="submit" loading={isLoading}>{isEdit ? t('common.save') : t('common.add')}</Button>
                    </ModalFooter>
                )}
            </form>
        </Modal>
    );
};

export default PurchaseOrderForm;
