import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Button = forwardRef(({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    children,
    ...props
}, ref) => {
    const variants = {
        primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm',
        secondary: 'bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)] shadow-sm',
        outline: 'border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:bg-slate-50',
        ghost: 'text-[var(--color-text-secondary)] hover:bg-slate-100 hover:text-[var(--color-text-primary)]',
        destructive: 'bg-[var(--color-error)] text-white hover:bg-red-600 shadow-sm',
        success: 'bg-[var(--color-success)] text-white hover:bg-green-600 shadow-sm',
    };

    const sizes = {
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-sm rounded-lg',
        lg: 'h-12 px-6 text-base rounded-lg',
        'icon-sm': 'h-8 w-8 rounded-md',
        icon: 'h-10 w-10 rounded-lg',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
