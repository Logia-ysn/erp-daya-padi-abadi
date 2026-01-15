import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Modal, ModalFooter, Button, Input, Label, Select } from '@/components/ui';

const WorksheetForm = ({ isOpen, onClose, onSubmit, initialData, mode, isLoading, machines = [] }) => {
    const { t } = useTranslation();
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const [form, setForm] = useState({
        worksheetNumber: '',
        productionDate: '',
        shift: '1',
        shiftLead: '',
        operatorCount: 1,
        workStartTime: '06:00',
        breakTime: '12:00',
        breakEndTime: '13:00',
        workEndTime: '14:00',
        machineId: '',
        machineName: '',
        targetProduction: 0,
        actualProduction: 0,
        downtimes: [],
        status: 'in_progress',
    });

    const [currentDowntime, setCurrentDowntime] = useState({
        startTime: '',
        endTime: '',
        category: 'mechanical',
        description: '',
    });

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else {
            const today = new Date().toISOString().split('T')[0];
            setForm({
                worksheetNumber: `WS-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
                productionDate: today,
                shift: '1',
                shiftLead: '',
                operatorCount: 1,
                workStartTime: '06:00',
                breakTime: '12:00',
                breakEndTime: '13:00',
                workEndTime: '14:00',
                machineId: '',
                machineName: '',
                targetProduction: 0,
                actualProduction: 0,
                downtimes: [],
                status: 'in_progress',
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleMachineChange = (machineId) => {
        const machine = machines.find(m => m.id === machineId);
        setForm(prev => ({ ...prev, machineId, machineName: machine?.name || '' }));
    };

    const handleShiftChange = (shift) => {
        // Auto-set shift times based on shift selection
        let startTime, breakTime, breakEndTime, endTime;
        if (shift === '1') {
            startTime = '06:00';
            breakTime = '12:00';
            breakEndTime = '13:00';
            endTime = '14:00';
        } else if (shift === '2') {
            startTime = '14:00';
            breakTime = '18:00';
            breakEndTime = '19:00';
            endTime = '22:00';
        } else if (shift === '3') {
            startTime = '22:00';
            breakTime = '02:00';
            breakEndTime = '03:00';
            endTime = '06:00';
        }
        setForm(prev => ({ ...prev, shift, workStartTime: startTime, breakTime, breakEndTime, workEndTime: endTime }));
    };

    const handleAddDowntime = () => {
        if (currentDowntime.startTime && currentDowntime.endTime && currentDowntime.description) {
            setForm(prev => ({
                ...prev,
                downtimes: [...prev.downtimes, { ...currentDowntime, id: Date.now() }]
            }));
            setCurrentDowntime({ startTime: '', endTime: '', category: 'mechanical', description: '' });
        }
    };

    const handleRemoveDowntime = (id) => {
        setForm(prev => ({
            ...prev,
            downtimes: prev.downtimes.filter(dt => dt.id !== id)
        }));
    };

    const calculateTotalDowntime = () => {
        return form.downtimes.reduce((total, dt) => {
            const start = new Date(`2000-01-01T${dt.startTime}`);
            const end = new Date(`2000-01-01T${dt.endTime}`);
            const diff = (end - start) / (1000 * 60 * 60); // hours
            return total + (diff > 0 ? diff : 0);
        }, 0).toFixed(2);
    };

    const achievementRate = form.targetProduction > 0
        ? ((form.actualProduction / form.targetProduction) * 100).toFixed(1)
        : 0;

    const downtimeCategories = [
        { value: 'mechanical', label: 'Mechanical Failure' },
        { value: 'electrical', label: 'Electrical Issue' },
        { value: 'material', label: 'Material Shortage' },
        { value: 'maintenance', label: 'Scheduled Maintenance' },
        { value: 'operator', label: 'Operator Issue' },
        { value: 'quality', label: 'Quality Control' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Worksheet' : isView ? 'Worksheet Details' : 'New Production Worksheet'} size="2xl">
            <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-primary)]">📋 Basic Information</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label required>Worksheet Number</Label>
                            <Input value={form.worksheetNumber} onChange={(e) => handleChange('worksheetNumber', e.target.value)} disabled={isView} required />
                        </div>
                        <div>
                            <Label required>Production Date</Label>
                            <Input type="date" value={form.productionDate} onChange={(e) => handleChange('productionDate', e.target.value)} disabled={isView} required />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select value={form.status} onChange={(e) => handleChange('status', e.target.value)} disabled={isView}>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Shift & Team Information */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-primary)]">👥 Shift & Team</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label required>Shift</Label>
                            <Select value={form.shift} onChange={(e) => handleShiftChange(e.target.value)} disabled={isView} required>
                                <option value="1">Shift 1</option>
                                <option value="2">Shift 2</option>
                                <option value="3">Shift 3</option>
                            </Select>
                        </div>
                        <div>
                            <Label required>Shift Lead</Label>
                            <Input value={form.shiftLead} onChange={(e) => handleChange('shiftLead', e.target.value)} disabled={isView} placeholder="Nama Shift Lead" required />
                        </div>
                        <div>
                            <Label required>Operator Count</Label>
                            <Input type="number" min="1" value={form.operatorCount} onChange={(e) => handleChange('operatorCount', Number(e.target.value))} disabled={isView} required />
                        </div>
                    </div>
                </div>

                {/* Work Schedule */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-primary)]">⏰ Work Schedule</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <Label required>Start Time</Label>
                            <Input type="time" value={form.workStartTime} onChange={(e) => handleChange('workStartTime', e.target.value)} disabled={isView} required />
                        </div>
                        <div>
                            <Label required>Break Start</Label>
                            <Input type="time" value={form.breakTime} onChange={(e) => handleChange('breakTime', e.target.value)} disabled={isView} required />
                        </div>
                        <div>
                            <Label required>Break End</Label>
                            <Input type="time" value={form.breakEndTime} onChange={(e) => handleChange('breakEndTime', e.target.value)} disabled={isView} required />
                        </div>
                        <div>
                            <Label required>End Time</Label>
                            <Input type="time" value={form.workEndTime} onChange={(e) => handleChange('workEndTime', e.target.value)} disabled={isView} required />
                        </div>
                    </div>
                </div>

                {/* Machine & Production Target */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-primary)]">🏭 Machine & Production</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label required>Machine Used</Label>
                            <Select value={form.machineId} onChange={(e) => handleMachineChange(e.target.value)} disabled={isView} required>
                                <option value="">-- Select Machine --</option>
                                {machines.filter(m => m.category === 'production').map(m => (
                                    <option key={m.id} value={m.id}>{m.name} ({m.model || 'N/A'})</option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label required>Target Production (kg)</Label>
                            <Input type="number" min="0" value={form.targetProduction} onChange={(e) => handleChange('targetProduction', Number(e.target.value))} disabled={isView} required />
                        </div>
                        <div>
                            <Label required>Actual Production (kg)</Label>
                            <Input type="number" min="0" value={form.actualProduction} onChange={(e) => handleChange('actualProduction', Number(e.target.value))} disabled={isView} required />
                        </div>
                    </div>
                </div>

                {/* Downtime Management */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-primary)]">⚠️ Downtime Records</h3>

                    {!isView && (
                        <div className="border border-[var(--color-border)] rounded-lg p-4 bg-gray-50 mb-4">
                            <h4 className="font-medium mb-3 text-sm">Add Downtime</h4>
                            <div className="grid grid-cols-5 gap-3 items-end">
                                <div>
                                    <Label>Start Time</Label>
                                    <Input type="time" value={currentDowntime.startTime} onChange={(e) => setCurrentDowntime(prev => ({ ...prev, startTime: e.target.value }))} />
                                </div>
                                <div>
                                    <Label>End Time</Label>
                                    <Input type="time" value={currentDowntime.endTime} onChange={(e) => setCurrentDowntime(prev => ({ ...prev, endTime: e.target.value }))} />
                                </div>
                                <div>
                                    <Label>Category</Label>
                                    <Select value={currentDowntime.category} onChange={(e) => setCurrentDowntime(prev => ({ ...prev, category: e.target.value }))}>
                                        {downtimeCategories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Input value={currentDowntime.description} onChange={(e) => setCurrentDowntime(prev => ({ ...prev, description: e.target.value }))} placeholder="Explain the issue..." />
                                </div>
                                <div>
                                    <Button type="button" onClick={handleAddDowntime} size="sm" variant="outline">
                                        <Plus className="w-4 h-4 mr-1" /> Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Downtime List */}
                    {form.downtimes.length > 0 ? (
                        <div className="space-y-2">
                            {form.downtimes.map((dt, index) => {
                                const start = new Date(`2000-01-01T${dt.startTime}`);
                                const end = new Date(`2000-01-01T${dt.endTime}`);
                                const duration = ((end - start) / (1000 * 60 * 60)).toFixed(2);

                                return (
                                    <div key={dt.id} className="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-lg bg-white">
                                        <div className="flex-1 grid grid-cols-5 gap-3 text-sm">
                                            <div>
                                                <span className="text-[var(--color-text-secondary)] text-xs">Time</span>
                                                <p className="font-medium">{dt.startTime} - {dt.endTime}</p>
                                            </div>
                                            <div>
                                                <span className="text-[var(--color-text-secondary)] text-xs">Duration</span>
                                                <p className="font-medium text-orange-600">{duration} hours</p>
                                            </div>
                                            <div>
                                                <span className="text-[var(--color-text-secondary)] text-xs">Category</span>
                                                <p className="font-medium capitalize">{downtimeCategories.find(c => c.value === dt.category)?.label}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-[var(--color-text-secondary)] text-xs">Description</span>
                                                <p className="font-medium">{dt.description}</p>
                                            </div>
                                        </div>
                                        {!isView && (
                                            <Button type="button" variant="ghost" size="icon-sm" onClick={() => handleRemoveDowntime(dt.id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-[var(--color-text-secondary)] bg-gray-50 rounded-lg border border-dashed border-[var(--color-border)]">
                            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No downtime recorded</p>
                        </div>
                    )}

                    {form.downtimes.length > 0 && (
                        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-orange-800">Total Downtime</span>
                                <span className="text-xl font-bold text-orange-600">{calculateTotalDowntime()} hours</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Achievement Summary */}
                <div className="p-4 bg-[var(--color-primary-light)] rounded-lg border border-[var(--color-primary)]">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-[var(--color-primary-dark)]">Achievement Rate</span>
                        <span className={`text-2xl font-bold ${Number(achievementRate) >= 100 ? 'text-[var(--color-success)]' : Number(achievementRate) >= 80 ? 'text-[var(--color-warning)]' : 'text-[var(--color-error)]'}`}>
                            {achievementRate}%
                        </span>
                    </div>
                    <div className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        Target: {form.targetProduction} kg • Actual: {form.actualProduction} kg
                    </div>
                </div>

                {!isView && (
                    <ModalFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" loading={isLoading}>
                            {isEdit ? t('common.save') : t('common.add')}
                        </Button>
                    </ModalFooter>
                )}
            </form>
        </Modal>
    );
};

export default WorksheetForm;
