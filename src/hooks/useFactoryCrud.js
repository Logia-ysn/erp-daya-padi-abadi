import { useState, useCallback, useEffect, useMemo } from 'react';
import { storage, generateId } from '@/lib/utils';
import { useFactory } from '@/contexts/FactoryContext';

/**
 * Factory-aware CRUD hook
 * Extends useCrud with automatic factory filtering
 * Data is filtered by active factory like Excel filter
 * 
 * @param {string} storageKey - localStorage key (shared across factories)
 * @param {Array} initialData - Initial data if storage is empty
 */
export function useFactoryCrud(storageKey, initialData = []) {
    const { activeFactory } = useFactory();
    const [allItems, setAllItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load all items from storage
    const loadItems = useCallback(() => {
        const stored = storage.get(storageKey);
        if (stored && stored.length > 0) {
            // Migrate existing data - add factoryId if missing
            const migrated = stored.map(item => ({
                ...item,
                factoryId: item.factoryId || 'factory_subang' // Default to Subang for existing data
            }));
            // Save migrated data back
            if (stored.some(item => !item.factoryId)) {
                storage.set(storageKey, migrated);
            }
            setAllItems(migrated);
        } else {
            // Initialize with initial data (add factoryId)
            const withFactory = initialData.map((item, index) => ({
                ...item,
                // Distribute mock data: even index = Subang, odd = Indramayu
                factoryId: item.factoryId || (index % 2 === 0 ? 'factory_subang' : 'factory_indramayu')
            }));
            storage.set(storageKey, withFactory);
            setAllItems(withFactory);
        }
    }, [storageKey, initialData]);

    // Load on mount
    useEffect(() => {
        loadItems();
    }, [loadItems]);

    // Filter items by active factory - useMemo to recalculate when factory changes
    const items = useMemo(() => {
        if (!activeFactory?.id) return allItems;
        return allItems.filter(item =>
            item.factoryId === activeFactory.id
        );
    }, [allItems, activeFactory?.id]);

    const refresh = useCallback(() => {
        loadItems();
    }, [loadItems]);

    const create = useCallback(async (data) => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 300));

        const newItem = {
            ...data,
            id: generateId(),
            factoryId: activeFactory?.id || 'factory_subang', // Auto-add factory
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const updated = [...allItems, newItem];
        storage.set(storageKey, updated);
        setAllItems(updated);
        setIsLoading(false);
        return newItem;
    }, [allItems, storageKey, activeFactory?.id]);

    const update = useCallback(async (id, data) => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 300));

        const updated = allItems.map(item =>
            item.id === id
                ? { ...item, ...data, updatedAt: new Date().toISOString() }
                : item
        );

        storage.set(storageKey, updated);
        setAllItems(updated);
        setIsLoading(false);
        return updated.find(i => i.id === id);
    }, [allItems, storageKey]);

    const remove = useCallback(async (id) => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 300));

        const updated = allItems.filter(item => item.id !== id);
        storage.set(storageKey, updated);
        setAllItems(updated);
        setIsLoading(false);
        return true;
    }, [allItems, storageKey]);

    const getById = useCallback((id) => {
        return items.find(item => item.id === id);
    }, [items]);

    // Get all items (unfiltered) - for admin/reports
    const getAllItems = useCallback(() => {
        return allItems;
    }, [allItems]);

    return {
        items,           // Filtered by factory
        allItems,        // All items (unfiltered)
        isLoading,
        create,
        update,
        remove,
        getById,
        refresh,
        getAllItems,
        activeFactoryId: activeFactory?.id,
    };
}

export default useFactoryCrud;
