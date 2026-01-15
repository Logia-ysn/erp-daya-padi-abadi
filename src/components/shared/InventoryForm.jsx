import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalFooter, Button, Input, Label, Select } from '@/components/ui';

const InventoryForm = ({ isOpen, onClose, onSubmit, initialData, mode, isLoading }) => {
    const { t } = useTranslation();
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const [form, setForm] = useState({
        code: '', name: '', type: 'raw', category: 'Bahan Baku', unit: 'kg', currentStock: 0, minStock: 0, maxStock: 0, location: '', pricePerUnit: 0, moistureContent: 0,
    });

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else {
            setForm({ code: '', name: '', type: 'raw', category: 'Bahan Baku', unit: 'kg', currentStock: 0, minStock: 0, maxStock: 0, location: '', pricePerUnit: 0, moistureContent: 0 });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };
    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const typeOptions = [
        { value: 'raw', label: t('inventory.rawMaterials'), category: 'Bahan Baku' },
        { value: 'wip', label: t('inventory.wip'), category: 'Work In Progress' },
        { value: 'finished', label: t('inventory.finishedGoods'), category: 'Barang Jadi' },
        { value: 'sparepart', label: t('inventory.spareparts'), category: 'Spareparts' },
    ];

    const handleTypeChange = (type) => {
        const option = typeOptions.find(o => o.value === type);
        setForm(prev => ({ ...prev, type, category: option?.category || '' }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Item' : isView ? 'Item Details' : 'Add Inventory Item'} size="lg">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label required>{t('inventory.itemCode')}</Label><Input value={form.code} onChange={(e) => handleChange('code', e.target.value)} disabled={isView} required placeholder="e.g. RM-001" /></div>
                    <div><Label required>{t('inventory.itemName')}</Label><Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} disabled={isView} required /></div>
                    <div><Label>{t('common.type')}</Label>
                        <Select value={form.type} onChange={(e) => handleTypeChange(e.target.value)} disabled={isView}>
                            {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </Select>
                    </div>
                    <div><Label>{t('common.unit')}</Label>
                        <Select value={form.unit} onChange={(e) => handleChange('unit', e.target.value)} disabled={isView}>
                            <option value="kg">kg</option><option value="ton">ton</option><option value="pcs">pcs</option><option value="karung">karung</option>
                        </Select>
                    </div>
                    <div><Label>{t('inventory.currentStock')}</Label><Input type="number" value={form.currentStock} onChange={(e) => handleChange('currentStock', Number(e.target.value))} disabled={isView} /></div>
                    <div><Label>{t('inventory.minStock')}</Label><Input type="number" value={form.minStock} onChange={(e) => handleChange('minStock', Number(e.target.value))} disabled={isView} /></div>
                    <div><Label>{t('inventory.maxStock')}</Label><Input type="number" value={form.maxStock} onChange={(e) => handleChange('maxStock', Number(e.target.value))} disabled={isView} /></div>
                    <div><Label>Price per Unit (Rp)</Label><Input type="number" value={form.pricePerUnit} onChange={(e) => handleChange('pricePerUnit', Number(e.target.value))} disabled={isView} /></div>
                    <div><Label>{t('inventory.location')}</Label><Input value={form.location} onChange={(e) => handleChange('location', e.target.value)} disabled={isView} placeholder="e.g. Gudang A" /></div>
                    {form.type === 'raw' && <div><Label>{t('procurement.moistureContent')} (%)</Label><Input type="number" value={form.moistureContent} onChange={(e) => handleChange('moistureContent', Number(e.target.value))} disabled={isView} /></div>}
                </div>
                {!isView && (<ModalFooter><Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>{t('common.cancel')}</Button><Button type="submit" loading={isLoading}>{isEdit ? t('common.save') : t('common.add')}</Button></ModalFooter>)}
            </form>
        </Modal>
    );
};

export default InventoryForm;
