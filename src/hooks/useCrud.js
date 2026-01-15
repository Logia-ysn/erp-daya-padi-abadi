import { useState, useCallback } from 'react';
import { storage, generateId } from '@/lib/utils';

/**
 * Generic CRUD hook for managing entity state
 * @param {string} storageKey - localStorage key
 * @param {Array} initialData - Initial data if storage is empty
 */
export function useCrud(storageKey, initialData = []) {
    const getInitialItems = () => {
        const stored = storage.get(storageKey);
        if (stored && stored.length > 0) return stored;
        storage.set(storageKey, initialData);
        return initialData;
    };

    const [items, setItems] = useState(getInitialItems);
    const [isLoading, setIsLoading] = useState(false);

    const refresh = useCallback(() => {
        setItems(storage.get(storageKey, []));
    }, [storageKey]);

    const create = useCallback(async (data) => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 300));

        const newItem = {
            ...data,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const updated = [...items, newItem];
        storage.set(storageKey, updated);
        setItems(updated);
        setIsLoading(false);
        return newItem;
    }, [items, storageKey]);

    const update = useCallback(async (id, data) => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 300));

        const updated = items.map(item =>
            item.id === id
                ? { ...item, ...data, updatedAt: new Date().toISOString() }
                : item
        );

        storage.set(storageKey, updated);
        setItems(updated);
        setIsLoading(false);
        return updated.find(i => i.id === id);
    }, [items, storageKey]);

    const remove = useCallback(async (id) => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 300));

        const updated = items.filter(item => item.id !== id);
        storage.set(storageKey, updated);
        setItems(updated);
        setIsLoading(false);
        return true;
    }, [items, storageKey]);

    const getById = useCallback((id) => {
        return items.find(item => item.id === id);
    }, [items]);

    return {
        items,
        isLoading,
        create,
        update,
        remove,
        getById,
        refresh,
    };
}

/**
 * Hook for managing modal state
 */
export function useModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('create'); // 'create' | 'edit' | 'view'
    const [selectedItem, setSelectedItem] = useState(null);

    const openCreate = useCallback(() => {
        setMode('create');
        setSelectedItem(null);
        setIsOpen(true);
    }, []);

    const openEdit = useCallback((item) => {
        setMode('edit');
        setSelectedItem(item);
        setIsOpen(true);
    }, []);

    const openView = useCallback((item) => {
        setMode('view');
        setSelectedItem(item);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setSelectedItem(null);
    }, []);

    return {
        isOpen,
        mode,
        selectedItem,
        openCreate,
        openEdit,
        openView,
        close,
    };
}

/**
 * Hook for confirm dialog
 */
export function useConfirm() {
    const [isOpen, setIsOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const openConfirm = useCallback((item) => {
        setItemToDelete(item);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setItemToDelete(null);
    }, []);

    return {
        isOpen,
        itemToDelete,
        openConfirm,
        close,
    };
}
