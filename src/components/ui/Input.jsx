import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(({ className, type = 'text', error, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                'flex h-10 w-full rounded-[var(--radius-md)] border bg-transparent px-3 py-2 text-sm',
                'placeholder:text-[var(--color-text-light)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'transition-colors duration-200',
                error
                    ? 'border-[var(--color-error)] focus-visible:ring-[var(--color-error)]'
                    : 'border-[var(--color-border)] focus-visible:ring-[var(--color-primary)]',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = 'Input';

const Label = forwardRef(({ className, required, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            'text-sm font-medium leading-none text-[var(--color-text-primary)]',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            className
        )}
        {...props}
    >
        {props.children}
        {required && <span className="text-[var(--color-error)] ml-1">*</span>}
    </label>
));
Label.displayName = 'Label';

const Textarea = forwardRef(({ className, error, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                'flex min-h-[80px] w-full rounded-[var(--radius-md)] border bg-transparent px-3 py-2 text-sm',
                'placeholder:text-[var(--color-text-light)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'transition-colors duration-200 resize-none',
                error
                    ? 'border-[var(--color-error)] focus-visible:ring-[var(--color-error)]'
                    : 'border-[var(--color-border)] focus-visible:ring-[var(--color-primary)]',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = 'Textarea';

const Select = forwardRef(({ className, error, children, ...props }, ref) => {
    return (
        <select
            className={cn(
                'flex h-10 w-full rounded-[var(--radius-md)] border bg-transparent px-3 py-2 text-sm',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'transition-colors duration-200',
                error
                    ? 'border-[var(--color-error)] focus-visible:ring-[var(--color-error)]'
                    : 'border-[var(--color-border)] focus-visible:ring-[var(--color-primary)]',
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </select>
    );
});
Select.displayName = 'Select';

export { Input, Label, Textarea, Select };
