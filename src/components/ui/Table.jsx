import { cn } from '@/lib/utils';

const Table = ({ className, ...props }) => (
    <div className="relative w-full overflow-auto">
        <table
            className={cn('w-full caption-bottom text-sm', className)}
            {...props}
        />
    </div>
);

const TableHeader = ({ className, ...props }) => (
    <thead className={cn('[&_tr]:border-b', className)} {...props} />
);

const TableBody = ({ className, ...props }) => (
    <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
);

const TableFooter = ({ className, ...props }) => (
    <tfoot
        className={cn(
            'border-t bg-slate-100/50 font-medium [&>tr]:last:border-b-0',
            className
        )}
        {...props}
    />
);

const TableRow = ({ className, ...props }) => (
    <tr
        className={cn(
            'border-b border-[var(--color-border)] transition-colors',
            'hover:bg-slate-50 data-[state=selected]:bg-slate-100',
            className
        )}
        {...props}
    />
);

const TableHead = ({ className, ...props }) => (
    <th
        className={cn(
            'h-12 px-4 text-left align-middle font-semibold text-[var(--color-text-secondary)]',
            '[&:has([role=checkbox])]:pr-0',
            className
        )}
        {...props}
    />
);

const TableCell = ({ className, ...props }) => (
    <td
        className={cn(
            'p-4 align-middle text-[var(--color-text-primary)]',
            '[&:has([role=checkbox])]:pr-0',
            className
        )}
        {...props}
    />
);

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell };
