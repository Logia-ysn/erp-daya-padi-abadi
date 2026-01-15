import { cn } from '@/lib/utils';

const Badge = ({ className, variant = 'default', children, ...props }) => {
    const variants = {
        default: 'bg-[var(--color-primary)] text-white',
        secondary: 'bg-slate-100 text-slate-900',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        outline: 'border border-[var(--color-border)] text-[var(--color-text-primary)]',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                'transition-colors duration-200',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const statusConfig = {
        active: { variant: 'success', label: 'Active' },
        inactive: { variant: 'secondary', label: 'Inactive' },
        pending: { variant: 'warning', label: 'Pending' },
        completed: { variant: 'success', label: 'Completed' },
        cancelled: { variant: 'error', label: 'Cancelled' },
        in_progress: { variant: 'warning', label: 'In Progress' },
        in_transit: { variant: 'warning', label: 'In Transit' },
        draft: { variant: 'secondary', label: 'Draft' },
        approved: { variant: 'success', label: 'Approved' },
        rejected: { variant: 'error', label: 'Rejected' },
        running: { variant: 'success', label: 'Running' },
        maintenance: { variant: 'warning', label: 'Maintenance' },
        idle: { variant: 'secondary', label: 'Idle' },
        paid: { variant: 'success', label: 'Paid' },
        unpaid: { variant: 'warning', label: 'Unpaid' },
        overdue: { variant: 'error', label: 'Overdue' },
    };

    const config = statusConfig[status] || { variant: 'secondary', label: status };

    return <Badge variant={config.variant}>{config.label}</Badge>;
};

export { Badge, StatusBadge };
