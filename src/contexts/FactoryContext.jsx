/**
 * Factory Context
 * Manages multiple factory/plant locations with data separation
 */

import { createContext, useContext, useState, useEffect } from 'react';

// Default factories
const defaultFactories = [
    {
        id: 'factory_subang',
        code: 'SUB',
        name: 'Factory Subang',
        company: 'PT Daya Padi Abadi',
        fullName: 'PT Daya Padi Abadi - Factory Subang',
        address: 'Jl. Industri No. 1, Subang, Jawa Barat',
        isActive: true,
        isDefault: true,
    },
    {
        id: 'factory_indramayu',
        code: 'IDM',
        name: 'Factory Indramayu',
        company: 'PT Daya Padi Abadi',
        fullName: 'PT Daya Padi Abadi - Factory Indramayu',
        address: 'Jl. Raya Indramayu No. 10, Indramayu, Jawa Barat',
        isActive: true,
        isDefault: false,
    },
];

const STORAGE_KEY = 'erp_factories';
const ACTIVE_FACTORY_KEY = 'erp_active_factory';

const FactoryContext = createContext(null);

export const FactoryProvider = ({ children }) => {
    const [factories, setFactories] = useState([]);
    const [activeFactory, setActiveFactory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load factories from localStorage
    useEffect(() => {
        const storedFactories = localStorage.getItem(STORAGE_KEY);
        const storedActiveFactory = localStorage.getItem(ACTIVE_FACTORY_KEY);

        if (storedFactories) {
            setFactories(JSON.parse(storedFactories));
        } else {
            // Initialize with default factories
            setFactories(defaultFactories);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFactories));
        }

        if (storedActiveFactory) {
            setActiveFactory(JSON.parse(storedActiveFactory));
        } else {
            // Set default factory as active
            const defaultFactory = defaultFactories.find(f => f.isDefault) || defaultFactories[0];
            setActiveFactory(defaultFactory);
            localStorage.setItem(ACTIVE_FACTORY_KEY, JSON.stringify(defaultFactory));
        }

        setIsLoading(false);
    }, []);

    // Switch active factory
    const switchFactory = (factoryId) => {
        const factory = factories.find(f => f.id === factoryId);
        if (factory) {
            setActiveFactory(factory);
            localStorage.setItem(ACTIVE_FACTORY_KEY, JSON.stringify(factory));
        }
    };

    // Add new factory
    const addFactory = (factoryData) => {
        const newFactory = {
            ...factoryData,
            id: `factory_${Date.now()}`,
            isActive: true,
            isDefault: false,
        };
        const updated = [...factories, newFactory];
        setFactories(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return newFactory;
    };

    // Update factory
    const updateFactory = (factoryId, data) => {
        const updated = factories.map(f =>
            f.id === factoryId ? { ...f, ...data } : f
        );
        setFactories(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Update active factory if it's the one being edited
        if (activeFactory?.id === factoryId) {
            const updatedActive = { ...activeFactory, ...data };
            setActiveFactory(updatedActive);
            localStorage.setItem(ACTIVE_FACTORY_KEY, JSON.stringify(updatedActive));
        }
    };

    // Delete factory
    const deleteFactory = (factoryId) => {
        // Don't allow deleting the last factory
        if (factories.length <= 1) {
            console.warn('Cannot delete the last factory');
            return false;
        }

        const updated = factories.filter(f => f.id !== factoryId);
        setFactories(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Switch to another factory if active one is deleted
        if (activeFactory?.id === factoryId) {
            const newActive = updated[0];
            setActiveFactory(newActive);
            localStorage.setItem(ACTIVE_FACTORY_KEY, JSON.stringify(newActive));
        }

        return true;
    };

    // Get storage key with factory prefix
    const getFactoryStorageKey = (baseKey) => {
        if (!activeFactory) return baseKey;
        return `${baseKey}_${activeFactory.id}`;
    };

    const value = {
        factories,
        activeFactory,
        isLoading,
        switchFactory,
        addFactory,
        updateFactory,
        deleteFactory,
        getFactoryStorageKey,
    };

    return (
        <FactoryContext.Provider value={value}>
            {children}
        </FactoryContext.Provider>
    );
};

export const useFactory = () => {
    const context = useContext(FactoryContext);
    if (!context) {
        throw new Error('useFactory must be used within a FactoryProvider');
    }
    return context;
};

export default FactoryContext;
