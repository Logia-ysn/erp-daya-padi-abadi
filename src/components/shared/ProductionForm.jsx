import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import { Modal, ModalFooter, Button, Input, Label, Select } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

const ProductionForm = ({ isOpen, onClose, onSubmit, initialData, mode, isLoading, machines = [], inventory = [] }) => {
    const { t } = useTranslation();
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const [form, setForm] = useState({
        woNumber: '', date: '', machineId: '', machineName: '', shift: '1', operator: '', status: 'in_progress',
        inputMaterial: '', inputQty: 0, inputMoistureContent: 0,
        outputProduct: 'Pellet Biomassa', outputQty: 0, outputMoistureContent: 0,
    });

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else {
            const today = new Date().toISOString().split('T')[0];
            setForm({
                woNumber: `WO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
                date: today, machineId: '', machineName: '', shift: '1', operator: '', status: 'in_progress',
                inputMaterial: 'Sekam Padi Kering', inputQty: 0, inputMoistureContent: 12,
                outputProduct: 'Pellet Biomassa', outputQty: 0, outputMoistureContent: 8,
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const yieldRate = form.inputQty > 0 ? ((form.outputQty / form.inputQty) * 100).toFixed(1) : 0;
        onSubmit({ ...form, yieldRate: Number(yieldRate) });
    };

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleMachineChange = (machineId) => {
        const machine = machines.find(m => m.id === machineId);
        setForm(prev => ({ ...prev, machineId, machineName: machine?.name || '', operator: machine?.operator || '' }));
    };

    const yieldRate = form.inputQty > 0 ? ((form.outputQty / form.inputQty) * 100).toFixed(1) : 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Work Order' : isView ? 'Work Order Details' : t('production.newWorkOrder')} size="xl">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div><Label required>{t('production.woNumber')}</Label><Input value={form.woNumber} onChange={(e) => handleChange('woNumber', e.target.value)} disabled={isView} required /></div>
                    <div><Label required>{t('common.date')}</Label><Input type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} disabled={isView} required /></div>
                    <div><Label>{t('common.status')}</Label>
                        <Select value={form.status} onChange={(e) => handleChange('status', e.target.value)} disabled={isView}>
                            <option value="pending">{t('common.pending')}</option>
                            <option value="in_progress">{t('common.in_progress')}</option>
                            <option value="completed">{t('common.completed')}</option>
                        </Select>
                    </div>
                    <div><Label required>{t('production.machine')}</Label>
                        <Select value={form.machineId} onChange={(e) => handleMachineChange(e.target.value)} disabled={isView} required>
                            <option value="">-- Select Machine --</option>
                            {machines.filter(m => m.status !== 'maintenance').map(m => (<option key={m.id} value={m.id}>{m.name}</option>))}
                        </Select>
                    </div>
                    <div><Label>{t('production.shift')}</Label>
                        <Select value={form.shift} onChange={(e) => handleChange('shift', e.target.value)} disabled={isView}>
                            <option value="1">Shift 1 (06:00 - 14:00)</option>
                            <option value="2">Shift 2 (14:00 - 22:00)</option>
                            <option value="3">Shift 3 (22:00 - 06:00)</option>
                        </Select>
                    </div>
                    <div><Label>{t('production.operator')}</Label><Input value={form.operator} onChange={(e) => handleChange('operator', e.target.value)} disabled={isView} /></div>
                </div>

                {/* Input Section */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="border border-[var(--color-border)] rounded-lg p-4 bg-blue-50">
                        <h4 className="font-semibold text-blue-800 mb-3">📥 Input Material</h4>
                        <div className="space-y-3">
                            <div><Label>{t('production.material')}</Label>
                                <Select value={form.inputMaterial} onChange={(e) => handleChange('inputMaterial', e.target.value)} disabled={isView}>
                                    <option value="Sekam Padi Kering">Sekam Padi Kering</option>
                                    <option value="Sekam Padi Basah">Sekam Padi Basah</option>
                                </Select>
                            </div>
                            <div><Label>{t('production.inputQty')} (kg)</Label><Input type="number" value={form.inputQty} onChange={(e) => handleChange('inputQty', Number(e.target.value))} disabled={isView} /></div>
                            <div><Label>{t('procurement.moistureContent')} (%)</Label><Input type="number" value={form.inputMoistureContent} onChange={(e) => handleChange('inputMoistureContent', Number(e.target.value))} disabled={isView} /></div>
                        </div>
                    </div>

                    <div className="border border-[var(--color-border)] rounded-lg p-4 bg-green-50">
                        <h4 className="font-semibold text-green-800 mb-3">📤 Output Product</h4>
                        <div className="space-y-3">
                            <div><Label>{t('production.product')}</Label>
                                <Select value={form.outputProduct} onChange={(e) => handleChange('outputProduct', e.target.value)} disabled={isView}>
                                    <option value="Pellet Biomassa">Pellet Biomassa</option>
                                    <option value="Pellet Premium">Pellet Premium Grade A</option>
                                </Select>
                            </div>
                            <div><Label>{t('production.outputQty')} (kg)</Label><Input type="number" value={form.outputQty} onChange={(e) => handleChange('outputQty', Number(e.target.value))} disabled={isView} /></div>
                            <div><Label>{t('procurement.moistureContent')} (%)</Label><Input type="number" value={form.outputMoistureContent} onChange={(e) => handleChange('outputMoistureContent', Number(e.target.value))} disabled={isView} /></div>
                        </div>
                    </div>
                </div>

                {/* Yield Summary */}
                <div className="mt-4 p-4 bg-[var(--color-primary-light)] rounded-lg border border-[var(--color-primary)]">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-[var(--color-primary-dark)]">{t('production.yieldRate')}</span>
                        <span className={`text-2xl font-bold ${Number(yieldRate) >= 85 ? 'text-[var(--color-success)]' : Number(yieldRate) >= 75 ? 'text-[var(--color-warning)]' : 'text-[var(--color-error)]'}`}>
                            {yieldRate}%
                        </span>
                    </div>
                </div>

                {!isView && (<ModalFooter><Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>{t('common.cancel')}</Button><Button type="submit" loading={isLoading}>{isEdit ? t('common.save') : t('common.add')}</Button></ModalFooter>)}
            </form>
        </Modal>
    );
};

export default ProductionForm;
