import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalFooter, Button, Input, Label, Textarea, Select } from '@/components/ui';

const CustomerForm = ({ isOpen, onClose, onSubmit, initialData, mode, isLoading }) => {
    const { t } = useTranslation();
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const [form, setForm] = useState({
        code: '', name: '', type: 'industry', address: '', contact: '', phone: '', paymentTerms: 30, status: 'active',
    });

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else {
            setForm({ code: `CUST-${String(Date.now()).slice(-3)}`, name: '', type: 'industry', address: '', contact: '', phone: '', paymentTerms: 30, status: 'active' });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };
    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Customer' : isView ? 'Customer Details' : t('sales.newCustomer')} size="lg">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label required>{t('sales.customerCode')}</Label><Input value={form.code} onChange={(e) => handleChange('code', e.target.value)} disabled={isView} required /></div>
                    <div><Label required>{t('sales.customerName')}</Label><Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} disabled={isView} required /></div>
                    <div><Label>{t('sales.customerType')}</Label>
                        <Select value={form.type} onChange={(e) => handleChange('type', e.target.value)} disabled={isView}>
                            <option value="pltu">{t('sales.pltu')}</option>
                            <option value="industry">{t('sales.industry')}</option>
                            <option value="end_customer">{t('sales.endCustomer')}</option>
                        </Select>
                    </div>
                    <div><Label>{t('sales.paymentTerms')} (days)</Label><Input type="number" value={form.paymentTerms} onChange={(e) => handleChange('paymentTerms', Number(e.target.value))} disabled={isView} /></div>
                    <div className="col-span-2"><Label>{t('procurement.address')}</Label><Textarea value={form.address} onChange={(e) => handleChange('address', e.target.value)} disabled={isView} rows={2} /></div>
                    <div><Label>{t('procurement.contactPerson')}</Label><Input value={form.contact} onChange={(e) => handleChange('contact', e.target.value)} disabled={isView} /></div>
                    <div><Label>{t('procurement.phone')}</Label><Input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} disabled={isView} /></div>
                    <div><Label>{t('common.status')}</Label>
                        <Select value={form.status} onChange={(e) => handleChange('status', e.target.value)} disabled={isView}>
                            <option value="active">{t('common.active')}</option>
                            <option value="inactive">{t('common.inactive')}</option>
                        </Select>
                    </div>
                </div>
                {!isView && (<ModalFooter><Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>{t('common.cancel')}</Button><Button type="submit" loading={isLoading}>{isEdit ? t('common.save') : t('common.add')}</Button></ModalFooter>)}
            </form>
        </Modal>
    );
};

export default CustomerForm;
