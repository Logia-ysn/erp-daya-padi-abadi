/**
 * Base API service with mock data support
 * In production, replace with actual API calls
 */

import { storage, generateId } from '@/lib/utils';

const STORAGE_KEYS = {
    SUPPLIERS: 'erp_suppliers',
    PURCHASE_ORDERS: 'erp_purchase_orders',
    CUSTOMERS: 'erp_customers',
    SALES_ORDERS: 'erp_sales_orders',
    INVENTORY: 'erp_inventory',
    MACHINES: 'erp_machines',
    MAINTENANCE: 'erp_maintenance',
    PRODUCTION: 'erp_production',
    // Production Module
    DOWNTIME: 'erp_downtime',
    STOCK: 'erp_stock',
    STOCK_MOVEMENTS: 'erp_stock_movements',
    MAINTENANCE_SCHEDULE: 'erp_maintenance_schedule',
    // Sales Module
    INVOICES: 'erp_invoices',
    PIC: 'erp_pic',
    // Finance Module
    EXPENSES: 'erp_expenses',
    // HRD Module
    ATTENDANCE: 'erp_attendance',
    EMPLOYEES: 'erp_employees',
};

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generic CRUD operations
export const createCrudService = (storageKey, defaultData = []) => {
    // Initialize default data if empty
    if (!storage.get(storageKey)) {
        storage.set(storageKey, defaultData);
    }

    return {
        getAll: async () => {
            await delay();
            return storage.get(storageKey, []);
        },

        getById: async (id) => {
            await delay();
            const items = storage.get(storageKey, []);
            return items.find(item => item.id === id);
        },

        create: async (data) => {
            await delay();
            const items = storage.get(storageKey, []);
            const newItem = {
                ...data,
                id: generateId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            items.push(newItem);
            storage.set(storageKey, items);
            return newItem;
        },

        update: async (id, data) => {
            await delay();
            const items = storage.get(storageKey, []);
            const index = items.findIndex(item => item.id === id);
            if (index === -1) throw new Error('Item not found');

            items[index] = {
                ...items[index],
                ...data,
                updatedAt: new Date().toISOString(),
            };
            storage.set(storageKey, items);
            return items[index];
        },

        delete: async (id) => {
            await delay();
            const items = storage.get(storageKey, []);
            const filtered = items.filter(item => item.id !== id);
            storage.set(storageKey, filtered);
            return true;
        },
    };
};

// Export storage keys for direct access if needed
export { STORAGE_KEYS };

// API helper for future real API integration
export const api = {
    get: async (endpoint) => {
        // Mock implementation - replace with fetch/axios
        await delay();
        console.log(`GET ${endpoint}`);
        return null;
    },
    post: async (endpoint, data) => {
        await delay();
        console.log(`POST ${endpoint}`, data);
        return data;
    },
    put: async (endpoint, data) => {
        await delay();
        console.log(`PUT ${endpoint}`, data);
        return data;
    },
    delete: async (endpoint) => {
        await delay();
        console.log(`DELETE ${endpoint}`);
        return true;
    },
};
