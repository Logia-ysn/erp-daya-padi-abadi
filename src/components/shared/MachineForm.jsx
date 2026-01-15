import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalFooter, Button, Input, Label, Select, Textarea } from '@/components/ui';

const MachineForm = ({ isOpen, onClose, onSubmit, initialData, mode, isLoading }) => {
    const { t } = useTranslation();
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const [form, setForm] = useState({
        code: '',
        name: '',
        model: '',
        category: 'production', // production or supporting
        runningHours: 0,
        maxHours: 3000,
        lastMaintenance: '',
        nextMaintenance: '',
        status: 'idle',
        operator: '',
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            code: `MCH-${String(Date.now()).slice(-3)}`,
            name: '',
            model: '',
            category: 'production',
            runningHours: 0,
            maxHours: 3000,
            lastMaintenance: '',
            nextMaintenance: '',
            status: 'idle',
            operator: ''
        });
    }, [initialData, isOpen]);

    const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };
    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Machine' : isView ? 'Machine Details' : 'Add Machine'} size="lg">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label required>{t('maintenance.machineId')}</Label><Input value={form.code} onChange={(e) => handleChange('code', e.target.value)} disabled={isView} required /></div>
                    <div><Label required>{t('maintenance.machineName')}</Label><Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} disabled={isView} required /></div>
                    <div><Label>{t('maintenance.model')}</Label><Input value={form.model} onChange={(e) => handleChange('model', e.target.value)} disabled={isView} placeholder="e.g. ZLSP-300B" /></div>

                    <div>
                        <Label required>Machine Category</Label>
                        <Select value={form.category} onChange={(e) => handleChange('category', e.target.value)} disabled={isView} required>
                            <option value="production">Production (Utama)</option>
                            <option value="supporting">Supporting</option>
                        </Select>
                    </div>

                    <div><Label>{t('production.operator')}</Label><Input value={form.operator} onChange={(e) => handleChange('operator', e.target.value)} disabled={isView} /></div>
                    <div><Label>{t('maintenance.runningHours')}</Label><Input type="number" value={form.runningHours} onChange={(e) => handleChange('runningHours', Number(e.target.value))} disabled={isView} /></div>
                    <div><Label>Max Hours (Service Interval)</Label><Input type="number" value={form.maxHours} onChange={(e) => handleChange('maxHours', Number(e.target.value))} disabled={isView} /></div>
                    <div><Label>{t('maintenance.lastMaintenance')}</Label><Input type="date" value={form.lastMaintenance} onChange={(e) => handleChange('lastMaintenance', e.target.value)} disabled={isView} /></div>
                    <div><Label>{t('maintenance.nextMaintenance')}</Label><Input type="date" value={form.nextMaintenance} onChange={(e) => handleChange('nextMaintenance', e.target.value)} disabled={isView} /></div>
                    <div><Label>{t('common.status')}</Label>
                        <Select value={form.status} onChange={(e) => handleChange('status', e.target.value)} disabled={isView}>
                            <option value="running">Running</option><option value="idle">Idle</option><option value="maintenance">Maintenance</option>
                        </Select>
                    </div>
                </div>
                {!isView && (<ModalFooter><Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>{t('common.cancel')}</Button><Button type="submit" loading={isLoading}>{isEdit ? t('common.save') : t('common.add')}</Button></ModalFooter>)}
            </form>
        </Modal>
    );
};

export default MachineForm;
