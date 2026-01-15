import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UserCheck, Users, Phone, Mail, Building, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, Input, Label } from '@/components/ui';
import { useCrud, useModal, useConfirm } from '@/hooks/useCrud';
import { STORAGE_KEYS } from '@/services/api';
import { mockPic } from '@/services/mockDataModules';
import { cn } from '@/lib/utils';

const PicPage = () => {
    const { t } = useTranslation();
    const { items: picData, isLoading, create, update, remove } = useCrud(STORAGE_KEYS.PIC, mockPic);
    const modal = useModal();
    const confirmDialog = useConfirm();
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        customerName: '',
        position: '',
        phone: '',
        email: '',
        status: 'active'
    });

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            customerName: '',
            position: '',
            phone: '',
            email: '',
            status: 'active'
        });
    };

    // Handle form open for edit
    useEffect(() => {
        if (modal.selectedItem && modal.mode === 'edit') {
            setFormData({
                name: modal.selectedItem.name || '',
                customerName: modal.selectedItem.customerName || '',
                position: modal.selectedItem.position || '',
                phone: modal.selectedItem.phone || '',
                email: modal.selectedItem.email || '',
                status: modal.selectedItem.status || 'active'
            });
        } else {
            resetForm();
        }
    }, [modal.selectedItem, modal.mode]);

    // Handle save
    const handleSave = async () => {
        const data = {
            ...formData,
            lastContact: new Date().toISOString().split('T')[0]
        };

        if (modal.mode === 'edit' && modal.selectedItem) {
            await update(modal.selectedItem.id, data);
        } else {
            await create(data);
        }
        modal.close();
        resetForm();
    };

    // Handle delete
    const handleDelete = async () => {
        if (confirmDialog.itemToDelete) {
            await remove(confirmDialog.itemToDelete.id);
            confirmDialog.close();
        }
    };

    // Toggle status
    const handleToggleStatus = async (pic) => {
        await update(pic.id, { status: pic.status === 'active' ? 'inactive' : 'active' });
    };

    // Filter PIC
    const filteredPic = useMemo(() => {
        if (!searchTerm) return picData;
        return picData.filter(pic =>
            pic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pic.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [picData, searchTerm]);

    const summaryCards = [
        { label: 'Total PIC', value: picData.length, icon: Users, color: 'blue' },
        { label: 'PIC Aktif', value: picData.filter(p => p.status === 'active').length, icon: UserCheck, color: 'green' },
        { label: 'Customer Terdaftar', value: [...new Set(picData.map(p => p.customerName))].length, icon: Building, color: 'purple' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">PIC (Person In Charge)</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Kelola kontak PIC customer</p>
                </div>
                <Button onClick={modal.openCreate} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Tambah PIC
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summaryCards.map((card, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-${card.color}-100`}>
                                    <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">{card.label}</p>
                                    <p className="text-2xl font-bold">{card.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* PIC Cards */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                        <CardTitle>Daftar PIC</CardTitle>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari PIC atau customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredPic.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPic.map((pic) => (
                                <div key={pic.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-lg">
                                                {pic.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{pic.name}</h3>
                                                <p className="text-sm text-[var(--color-text-secondary)]">{pic.position}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggleStatus(pic)}
                                            className={cn(
                                                'px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-all',
                                                pic.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            )}
                                        >
                                            {pic.status === 'active' ? 'Aktif' : 'Inactive'}
                                        </button>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Building className="w-4 h-4 text-gray-400" />
                                            <span className="text-[var(--color-text-secondary)]">{pic.customerName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span>{pic.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span className="text-blue-600">{pic.email}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <span className="text-xs text-gray-400">Last contact: {pic.lastContact}</span>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => modal.openEdit(pic)}
                                                className="p-1.5 hover:bg-gray-100 rounded"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4 text-gray-500" />
                                            </button>
                                            <button
                                                onClick={() => confirmDialog.openConfirm(pic)}
                                                className="p-1.5 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-gray-400">
                            {searchTerm ? 'Tidak ada hasil pencarian' : 'Belum ada data PIC'}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit PIC Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => { modal.close(); resetForm(); }}
                title={modal.mode === 'edit' ? 'Edit PIC' : 'Tambah PIC Baru'}
            >
                <div className="space-y-4">
                    <div>
                        <Label>Nama Lengkap *</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nama PIC"
                        />
                    </div>
                    <div>
                        <Label>Customer *</Label>
                        <Input
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            placeholder="Nama Customer / Perusahaan"
                        />
                    </div>
                    <div>
                        <Label>Jabatan</Label>
                        <Input
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            placeholder="Jabatan"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>No. Telepon</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="08xx-xxxx-xxxx"
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@company.com"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Status</Label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        >
                            <option value="active">Aktif</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => { modal.close(); resetForm(); }} className="flex-1">
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1"
                            disabled={!formData.name || !formData.customerName}
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={confirmDialog.isOpen}
                onClose={confirmDialog.close}
                title="Konfirmasi Hapus"
            >
                <div className="space-y-4">
                    <p className="text-[var(--color-text-secondary)]">
                        Apakah Anda yakin ingin menghapus PIC <strong>{confirmDialog.itemToDelete?.name}</strong>?
                    </p>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={confirmDialog.close} className="flex-1">
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} className="flex-1">
                            {isLoading ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PicPage;
