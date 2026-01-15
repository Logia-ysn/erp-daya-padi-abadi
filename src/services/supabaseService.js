/**
 * Supabase Service Layer
 * Provides CRUD operations with Supabase backend
 * Falls back to localStorage if Supabase is not configured
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { storage, generateId } from '@/lib/utils';

// Table names mapping
export const TABLES = {
    SUPPLIERS: 'suppliers',
    PURCHASE_ORDERS: 'purchase_orders',
    CUSTOMERS: 'customers',
    SALES_ORDERS: 'sales_orders',
    INVENTORY: 'inventory',
    MACHINES: 'machines',
    MAINTENANCE: 'maintenance',
    PRODUCTION: 'production',
    DOWNTIME: 'downtime',
    STOCK: 'stock',
    MAINTENANCE_SCHEDULE: 'maintenance_schedule',
    INVOICES: 'invoices',
    PIC: 'pic',
    EXPENSES: 'expenses',
    ATTENDANCE: 'attendance',
    EMPLOYEES: 'employees',
};

// Simulate API delay for localStorage
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create a CRUD service for a specific table
 * Automatically uses Supabase if configured, otherwise falls back to localStorage
 */
export const createSupabaseCrudService = (tableName, localStorageKey) => {
    const useSupabase = isSupabaseConfigured();

    return {
        /**
         * Get all records
         */
        getAll: async (filters = {}) => {
            if (useSupabase) {
                try {
                    let query = supabase.from(tableName).select('*');

                    // Apply filters if provided
                    Object.entries(filters).forEach(([key, value]) => {
                        query = query.eq(key, value);
                    });

                    const { data, error } = await query.order('created_at', { ascending: false });

                    if (error) throw error;
                    return data || [];
                } catch (error) {
                    console.error(`Error fetching from ${tableName}:`, error);
                    throw error;
                }
            } else {
                // Fallback to localStorage
                await delay();
                return storage.get(localStorageKey, []);
            }
        },

        /**
         * Get a single record by ID
         */
        getById: async (id) => {
            if (useSupabase) {
                try {
                    const { data, error } = await supabase
                        .from(tableName)
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (error) throw error;
                    return data;
                } catch (error) {
                    console.error(`Error fetching ${tableName} by ID:`, error);
                    throw error;
                }
            } else {
                // Fallback to localStorage
                await delay();
                const items = storage.get(localStorageKey, []);
                return items.find(item => item.id === id);
            }
        },

        /**
         * Create a new record
         */
        create: async (data) => {
            if (useSupabase) {
                try {
                    const newRecord = {
                        ...data,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };

                    const { data: created, error } = await supabase
                        .from(tableName)
                        .insert([newRecord])
                        .select()
                        .single();

                    if (error) throw error;
                    return created;
                } catch (error) {
                    console.error(`Error creating ${tableName}:`, error);
                    throw error;
                }
            } else {
                // Fallback to localStorage
                await delay();
                const items = storage.get(localStorageKey, []);
                const newItem = {
                    ...data,
                    id: generateId(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                items.push(newItem);
                storage.set(localStorageKey, items);
                return newItem;
            }
        },

        /**
         * Update an existing record
         */
        update: async (id, data) => {
            if (useSupabase) {
                try {
                    const updateData = {
                        ...data,
                        updated_at: new Date().toISOString(),
                    };

                    const { data: updated, error } = await supabase
                        .from(tableName)
                        .update(updateData)
                        .eq('id', id)
                        .select()
                        .single();

                    if (error) throw error;
                    return updated;
                } catch (error) {
                    console.error(`Error updating ${tableName}:`, error);
                    throw error;
                }
            } else {
                // Fallback to localStorage
                await delay();
                const items = storage.get(localStorageKey, []);
                const index = items.findIndex(item => item.id === id);

                if (index === -1) throw new Error('Item not found');

                items[index] = {
                    ...items[index],
                    ...data,
                    updatedAt: new Date().toISOString(),
                };
                storage.set(localStorageKey, items);
                return items[index];
            }
        },

        /**
         * Delete a record
         */
        delete: async (id) => {
            if (useSupabase) {
                try {
                    const { error } = await supabase
                        .from(tableName)
                        .delete()
                        .eq('id', id);

                    if (error) throw error;
                    return true;
                } catch (error) {
                    console.error(`Error deleting from ${tableName}:`, error);
                    throw error;
                }
            } else {
                // Fallback to localStorage
                await delay();
                const items = storage.get(localStorageKey, []);
                const filtered = items.filter(item => item.id !== id);
                storage.set(localStorageKey, filtered);
                return true;
            }
        },

        /**
         * Subscribe to real-time changes (Supabase only)
         */
        subscribe: (callback) => {
            if (!useSupabase) {
                console.warn('Real-time subscriptions require Supabase configuration');
                return null;
            }

            const subscription = supabase
                .channel(`${tableName}_changes`)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: tableName },
                    (payload) => {
                        callback(payload);
                    }
                )
                .subscribe();

            return subscription;
        },

        /**
         * Unsubscribe from real-time changes
         */
        unsubscribe: (subscription) => {
            if (subscription) {
                supabase.removeChannel(subscription);
            }
        },
    };
};

// Export configured services for each table
export const supabaseServices = {
    suppliers: createSupabaseCrudService(TABLES.SUPPLIERS, 'erp_suppliers'),
    purchaseOrders: createSupabaseCrudService(TABLES.PURCHASE_ORDERS, 'erp_purchase_orders'),
    customers: createSupabaseCrudService(TABLES.CUSTOMERS, 'erp_customers'),
    salesOrders: createSupabaseCrudService(TABLES.SALES_ORDERS, 'erp_sales_orders'),
    inventory: createSupabaseCrudService(TABLES.INVENTORY, 'erp_inventory'),
    machines: createSupabaseCrudService(TABLES.MACHINES, 'erp_machines'),
    maintenance: createSupabaseCrudService(TABLES.MAINTENANCE, 'erp_maintenance'),
    production: createSupabaseCrudService(TABLES.PRODUCTION, 'erp_production'),
    downtime: createSupabaseCrudService(TABLES.DOWNTIME, 'erp_downtime'),
    stock: createSupabaseCrudService(TABLES.STOCK, 'erp_stock'),
    maintenanceSchedule: createSupabaseCrudService(TABLES.MAINTENANCE_SCHEDULE, 'erp_maintenance_schedule'),
    invoices: createSupabaseCrudService(TABLES.INVOICES, 'erp_invoices'),
    pic: createSupabaseCrudService(TABLES.PIC, 'erp_pic'),
    expenses: createSupabaseCrudService(TABLES.EXPENSES, 'erp_expenses'),
    attendance: createSupabaseCrudService(TABLES.ATTENDANCE, 'erp_attendance'),
    employees: createSupabaseCrudService(TABLES.EMPLOYEES, 'erp_employees'),
};

export default supabaseServices;
