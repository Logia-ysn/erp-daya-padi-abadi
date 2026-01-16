import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, FileText, Users, Clock, TrendingUp, Edit, Trash2, Eye, AlertCircle, X, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, StatusBadge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, ConfirmModal, Select, Label } from '@/components/ui';
import { WorksheetForm } from '@/components/shared';
import { useCrud, useModal, useConfirm } from '@/hooks';
import { formatNumber, formatDateShort, cn } from '@/lib/utils';
import { mockWorksheets, mockMachines } from '@/services/mockData';
import { updateStockFromWorksheet, removeStockFromWorksheet } from '@/services/stockIntegration';

const WorksheetPage = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        machineId: '',
        shift: '',
        status: '',
    });

    const worksheets = useCrud('erp_worksheets', mockWorksheets);
    const machines = useCrud('erp_machines', mockMachines);
    const worksheetModal = useModal();
    const confirmDialog = useConfirm();

    // Advanced filtering with date range and machine
    const filteredWorksheets = useMemo(() => {
        return worksheets.items.filter(ws => {
            // Search filter
            const matchesSearch = !searchTerm ||
                ws.worksheetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ws.shiftLead.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ws.machineName.toLowerCase().includes(searchTerm.toLowerCase());

            // Date range filter
            const matchesDateRange = (!filters.startDate || ws.productionDate >= filters.startDate) &&
                (!filters.endDate || ws.productionDate <= filters.endDate);

            // Machine filter
            const matchesMachine = !filters.machineId || ws.machineId === filters.machineId;

            // Shift filter
            const matchesShift = !filters.shift || ws.shift === filters.shift;

            // Status filter
            const matchesStatus = !filters.status || ws.status === filters.status;

            return matchesSearch && matchesDateRange && matchesMachine && matchesShift && matchesStatus;
        });
    }, [worksheets.items, searchTerm, filters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const clearFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            machineId: '',
            shift: '',
            status: '',
        });
        setSearchTerm('');
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== '') || searchTerm !== '';

    // Calculate metrics
    const totalTarget = worksheets.items.reduce((sum, ws) => sum + ws.targetProduction, 0);
    const totalActual = worksheets.items.reduce((sum, ws) => sum + ws.actualProduction, 0);
    const avgAchievement = totalTarget > 0 ? ((totalActual / totalTarget) * 100).toFixed(1) : 0;
    const totalDowntime = worksheets.items.reduce((sum, ws) => {
        return sum + ws.downtimes.reduce((dtSum, dt) => {
            const start = new Date(`2000-01-01T${dt.startTime}`);
            const end = new Date(`2000-01-01T${dt.endTime}`);
            return dtSum + ((end - start) / (1000 * 60 * 60));
        }, 0);
    }, 0).toFixed(1);

    const handleSubmit = async (data) => {
        try {
            if (worksheetModal.mode === 'edit') {
                // Get previous worksheet data before update
                const previousWorksheet = worksheetModal.selectedItem;

                // Update worksheet
                await worksheets.update(worksheetModal.selectedItem.id, data);

                // Update stock based on the change
                await updateStockFromWorksheet(data, previousWorksheet);
            } else {
                // Create new worksheet
                await worksheets.create(data);

                // Update stock for new production
                await updateStockFromWorksheet(data);
            }

            worksheetModal.close();
        } catch (error) {
            console.error('Error saving worksheet:', error);
        }
    };

    const handleDelete = async () => {
        try {
            // Remove stock before deleting worksheet
            await removeStockFromWorksheet(confirmDialog.itemToDelete);

            // Delete worksheet
            await worksheets.remove(confirmDialog.itemToDelete.id);

            confirmDialog.close();
        } catch (error) {
            console.error('Error deleting worksheet:', error);
        }
    };

    const calculateDowntime = (downtimes) => {
        return downtimes.reduce((sum, dt) => {
            const start = new Date(`2000-01-01T${dt.startTime}`);
            const end = new Date(`2000-01-01T${dt.endTime}`);
            return sum + ((end - start) / (1000 * 60 * 60));
        }, 0).toFixed(1);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Production Worksheets</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Manage daily production worksheets and track performance</p>
                </div>
                <Button onClick={() => worksheetModal.openCreate()}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Worksheet
                </Button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Total Worksheets</p>
                                <p className="text-xl font-bold">{worksheets.items.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Avg Achievement</p>
                                <p className={cn('text-xl font-bold',
                                    avgAchievement >= 100 ? 'text-[var(--color-success)]' :
                                        avgAchievement >= 80 ? 'text-[var(--color-warning)]' :
                                            'text-[var(--color-error)]'
                                )}>
                                    {avgAchievement}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Active Shifts</p>
                                <p className="text-xl font-bold">
                                    {worksheets.items.filter(ws => ws.status === 'in_progress').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Total Downtime</p>
                                <p className="text-xl font-bold text-orange-600">{totalDowntime}h</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <div className="space-y-3">
                <div className="flex gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
                        <Input
                            placeholder="Search worksheets..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        variant={showFilters ? "default" : "outline"}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                        {hasActiveFilters && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                                {Object.values(filters).filter(v => v !== '').length + (searchTerm ? 1 : 0)}
                            </span>
                        )}
                    </Button>
                    {hasActiveFilters && (
                        <Button variant="ghost" onClick={clearFilters}>
                            <X className="w-4 h-4 mr-2" />
                            Clear Filters
                        </Button>
                    )}
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <Card className="animate-fade-in">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div>
                                    <Label className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        Start Date
                                    </Label>
                                    <Input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        End Date
                                    </Label>
                                    <Input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2">Machine</Label>
                                    <Select
                                        value={filters.machineId}
                                        onChange={(e) => handleFilterChange('machineId', e.target.value)}
                                    >
                                        <option value="">All Machines</option>
                                        {machines.items.map(machine => (
                                            <option key={machine.id} value={machine.id}>
                                                {machine.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <Label className="mb-2">Shift</Label>
                                    <Select
                                        value={filters.shift}
                                        onChange={(e) => handleFilterChange('shift', e.target.value)}
                                    >
                                        <option value="">All Shifts</option>
                                        <option value="1">Shift 1</option>
                                        <option value="2">Shift 2</option>
                                        <option value="3">Shift 3</option>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="mb-2">Status</Label>
                                    <Select
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </Select>
                                </div>
                            </div>

                            {/* Filter Results Summary */}
                            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    Showing <span className="font-semibold text-[var(--color-primary)]">{filteredWorksheets.length}</span> of {worksheets.items.length} worksheets
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Worksheets Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Worksheet #</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Shift & Lead</TableHead>
                                <TableHead>Machine</TableHead>
                                <TableHead className="text-right">Target (kg)</TableHead>
                                <TableHead className="text-right">Actual (kg)</TableHead>
                                <TableHead className="text-right">Karung/Bag</TableHead>
                                <TableHead className="text-right">Achievement</TableHead>
                                <TableHead className="text-center">Downtime</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[120px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredWorksheets.map((worksheet) => {
                                const achievement = worksheet.targetProduction > 0
                                    ? ((worksheet.actualProduction / worksheet.targetProduction) * 100).toFixed(1)
                                    : 0;
                                const downtime = calculateDowntime(worksheet.downtimes);

                                return (
                                    <TableRow key={worksheet.id}>
                                        <TableCell className="font-medium text-[var(--color-primary)]">
                                            {worksheet.worksheetNumber}
                                        </TableCell>
                                        <TableCell>{formatDateShort(worksheet.productionDate)}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">Shift {worksheet.shift}</p>
                                                <p className="text-xs text-[var(--color-text-secondary)]">
                                                    {worksheet.shiftLead} • {worksheet.operatorCount} operators
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{worksheet.machineName}</p>
                                                <p className="text-xs text-[var(--color-text-secondary)]">
                                                    {worksheet.workStartTime} - {worksheet.workEndTime}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatNumber(worksheet.targetProduction)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatNumber(worksheet.actualProduction)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {worksheet.bagCount > 0 ? (
                                                <div>
                                                    <span className="font-medium">{formatNumber(worksheet.bagCount)}</span>
                                                    <span className="text-xs text-[var(--color-text-secondary)] ml-1">
                                                        {worksheet.packagingType || 'karung'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-[var(--color-text-secondary)]">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className={cn('font-bold',
                                                achievement >= 100 ? 'text-[var(--color-success)]' :
                                                    achievement >= 80 ? 'text-[var(--color-warning)]' :
                                                        'text-[var(--color-error)]'
                                            )}>
                                                {achievement}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {worksheet.downtimes.length > 0 ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <AlertCircle className="w-4 h-4 text-orange-500" />
                                                    <span className="text-sm font-medium text-orange-600">
                                                        {downtime}h
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-[var(--color-text-secondary)]">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={worksheet.status} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => worksheetModal.openView(worksheet)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => worksheetModal.openEdit(worksheet)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => confirmDialog.openConfirm(worksheet)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <WorksheetForm
                isOpen={worksheetModal.isOpen}
                onClose={worksheetModal.close}
                onSubmit={handleSubmit}
                initialData={worksheetModal.selectedItem}
                mode={worksheetModal.mode}
                isLoading={worksheets.isLoading}
                machines={machines.items}
            />

            <ConfirmModal
                isOpen={confirmDialog.isOpen}
                onClose={confirmDialog.close}
                onConfirm={handleDelete}
                title="Delete Worksheet"
                message={`Delete worksheet "${confirmDialog.itemToDelete?.worksheetNumber}"?`}
                loading={worksheets.isLoading}
            />
        </div>
    );
};

export default WorksheetPage;
