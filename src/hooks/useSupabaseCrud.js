/**
 * useSupabaseCrud Hook
 * Enhanced CRUD hook with Supabase integration
 * Automatically uses Supabase if configured, falls back to localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { createSupabaseCrudService } from '@/services/supabaseService';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * Custom hook for CRUD operations with Supabase
 * @param {string} tableName - Supabase table name
 * @param {string} storageKey - localStorage key (fallback)
 * @param {Array} initialData - Initial data if localStorage is empty
 * @param {Object} options - Additional options
 * @returns {Object} CRUD methods and state
 */
export const useSupabaseCrud = (tableName, storageKey, initialData = [], options = {}) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const service = createSupabaseCrudService(tableName, storageKey);
    const useRealtime = options.realtime !== false && isSupabaseConfigured();

    // Load initial data
    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await service.getAll(options.filters || {});

            // If no data and initialData provided, seed the database
            if (data.length === 0 && initialData.length > 0) {
                const seededData = [];
                for (const item of initialData) {
                    const created = await service.create(item);
                    seededData.push(created);
                }
                setItems(seededData);
            } else {
                setItems(data);
            }
            setIsInitialized(true);
        } catch (err) {
            console.error('Error loading data:', err);
            setError(err.message);
            // Fallback to empty array on error
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }, [tableName, storageKey]);

    // Initial load
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Real-time subscription
    useEffect(() => {
        if (!useRealtime || !isInitialized) return;

        const subscription = service.subscribe((payload) => {
            console.log(`Real-time update on ${tableName}:`, payload);

            if (payload.eventType === 'INSERT') {
                setItems(prev => [payload.new, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
                setItems(prev => prev.map(item =>
                    item.id === payload.new.id ? payload.new : item
                ));
            } else if (payload.eventType === 'DELETE') {
                setItems(prev => prev.filter(item => item.id !== payload.old.id));
            }
        });

        return () => {
            service.unsubscribe(subscription);
        };
    }, [useRealtime, isInitialized, tableName]);

    // Create
    const create = useCallback(async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const newItem = await service.create(data);

            // Only update local state if not using real-time
            // (real-time will handle it via subscription)
            if (!useRealtime) {
                setItems(prev => [newItem, ...prev]);
            }

            return newItem;
        } catch (err) {
            console.error('Error creating item:', err);
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [service, useRealtime]);

    // Update
    const update = useCallback(async (id, data) => {
        setIsLoading(true);
        setError(null);
        try {
            const updated = await service.update(id, data);

            // Only update local state if not using real-time
            if (!useRealtime) {
                setItems(prev => prev.map(item =>
                    item.id === id ? updated : item
                ));
            }

            return updated;
        } catch (err) {
            console.error('Error updating item:', err);
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [service, useRealtime]);

    // Delete
    const remove = useCallback(async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            await service.delete(id);

            // Only update local state if not using real-time
            if (!useRealtime) {
                setItems(prev => prev.filter(item => item.id !== id));
            }

            return true;
        } catch (err) {
            console.error('Error deleting item:', err);
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [service, useRealtime]);

    // Get by ID
    const getById = useCallback(async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const item = await service.getById(id);
            return item;
        } catch (err) {
            console.error('Error fetching item:', err);
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [service]);

    // Refresh data
    const refresh = useCallback(async () => {
        await loadData();
    }, [loadData]);

    return {
        items,
        isLoading,
        error,
        create,
        update,
        remove,
        getById,
        refresh,
        isSupabase: isSupabaseConfigured(),
    };
};

// Re-export modal and confirm hooks for convenience
export { useModal, useConfirm } from './useCrud';

export default useSupabaseCrud;
