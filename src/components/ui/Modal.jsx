import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showClose = true,
}) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw]',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className={cn(
                    'relative w-full mx-4 bg-[var(--color-bg-card)] rounded-[var(--radius-xl)]',
                    'shadow-2xl animate-scale-in max-h-[90vh] flex flex-col',
                    sizes[size]
                )}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-[var(--color-border)]">
                    <div>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{title}</h2>
                        {description && (
                            <p className="text-sm text-[var(--color-text-secondary)] mt-1">{description}</p>
                        )}
                    </div>
                    {showClose && (
                        <button
                            onClick={onClose}
                            className="p-2 -m-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ModalFooter = ({ children, className }) => (
    <div className={cn(
        'flex items-center justify-end gap-3 pt-6 mt-6 border-t border-[var(--color-border)]',
        className
    )}>
        {children}
    </div>
);

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'destructive',
    loading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p className="text-[var(--color-text-secondary)]">{message}</p>
            <ModalFooter>
                <Button variant="outline" onClick={onClose} disabled={loading}>
                    {cancelText}
                </Button>
                <Button variant={variant} onClick={onConfirm} loading={loading}>
                    {confirmText}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export { Modal, ModalFooter, ConfirmModal };
