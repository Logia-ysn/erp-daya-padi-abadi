/**
 * Factory Selector Component
 * Dropdown to switch between factories
 */

import { useState } from 'react';
import { Building2, ChevronDown, Plus, Settings } from 'lucide-react';
import { useFactory } from '@/contexts/FactoryContext';
import { Modal, Button, Input, Label } from '@/components/ui';

const FactorySelector = () => {
    const { factories, activeFactory, switchFactory, addFactory } = useFactory();
    const [isOpen, setIsOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFactory, setNewFactory] = useState({
        code: '',
        name: '',
        company: 'PT Daya Padi Abadi',
        address: '',
    });

    const handleFactoryChange = (factoryId) => {
        switchFactory(factoryId);
        setIsOpen(false);
    };

    const handleAddFactory = () => {
        if (newFactory.code && newFactory.name) {
            addFactory({
                ...newFactory,
                fullName: `${newFactory.company} - ${newFactory.name}`,
            });
            setNewFactory({
                code: '',
                name: '',
                company: 'PT Daya Padi Abadi',
                address: '',
            });
            setShowAddModal(false);
        }
    };

    if (!activeFactory) return null;

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-light)]/80 transition-colors border border-[var(--color-primary)]/20"
                >
                    <Building2 className="w-4 h-4 text-[var(--color-primary)]" />
                    <div className="text-left">
                        <p className="text-xs text-[var(--color-text-secondary)]">{activeFactory.company}</p>
                        <p className="text-sm font-medium text-[var(--color-primary)]">{activeFactory.name}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[var(--color-primary)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-[var(--color-border)] z-50 overflow-hidden">
                            <div className="p-2 border-b border-[var(--color-border)]">
                                <p className="text-xs font-medium text-[var(--color-text-secondary)] px-2 py-1">
                                    Select Factory
                                </p>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {factories.map(factory => (
                                    <button
                                        key={factory.id}
                                        onClick={() => handleFactoryChange(factory.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors ${activeFactory?.id === factory.id ? 'bg-[var(--color-primary-light)]' : ''
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${activeFactory?.id === factory.id
                                                ? 'bg-[var(--color-primary)] text-white'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {factory.code}
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className="font-medium text-sm">{factory.name}</p>
                                            <p className="text-xs text-[var(--color-text-secondary)]">{factory.company}</p>
                                        </div>
                                        {activeFactory?.id === factory.id && (
                                            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="p-2 border-t border-[var(--color-border)]">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setShowAddModal(true);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Tambah Factory Baru
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Add Factory Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Tambah Factory Baru"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label required>Kode Factory</Label>
                            <Input
                                value={newFactory.code}
                                onChange={(e) => setNewFactory({ ...newFactory, code: e.target.value.toUpperCase() })}
                                placeholder="SUB"
                                maxLength={5}
                            />
                        </div>
                        <div>
                            <Label required>Nama Factory</Label>
                            <Input
                                value={newFactory.name}
                                onChange={(e) => setNewFactory({ ...newFactory, name: e.target.value })}
                                placeholder="Factory Subang"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Nama Perusahaan</Label>
                        <Input
                            value={newFactory.company}
                            onChange={(e) => setNewFactory({ ...newFactory, company: e.target.value })}
                            placeholder="PT Daya Padi Abadi"
                        />
                    </div>
                    <div>
                        <Label>Alamat</Label>
                        <Input
                            value={newFactory.address}
                            onChange={(e) => setNewFactory({ ...newFactory, address: e.target.value })}
                            placeholder="Jl. Industri No. 1, Subang"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                            Batal
                        </Button>
                        <Button
                            onClick={handleAddFactory}
                            className="flex-1"
                            disabled={!newFactory.code || !newFactory.name}
                        >
                            Tambah Factory
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default FactorySelector;
