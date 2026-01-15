/**
 * Update & Version Management Service
 * Handles system versioning, updates, and changelog
 */

import { APP_VERSION } from './backupService';

// Changelog data - update this with each release
export const CHANGELOG = [
    {
        version: '1.0.0',
        date: '2026-01-12',
        type: 'major',
        title: 'Initial Release',
        changes: [
            { type: 'feature', text: 'Dashboard dengan KPI dan grafik produksi' },
            { type: 'feature', text: 'Modul Procurement - Supplier & Purchase Order' },
            { type: 'feature', text: 'Modul Production - Work Order Management' },
            { type: 'feature', text: 'Modul Inventory - Raw Materials, WIP, Finished Goods' },
            { type: 'feature', text: 'Modul Maintenance - Machine & Schedule' },
            { type: 'feature', text: 'Modul Sales - Customer & Sales Order' },
            { type: 'feature', text: 'Modul Finance - COGS Calculator' },
            { type: 'feature', text: 'Multi-language support (ID/EN)' },
            { type: 'feature', text: 'Backup & Restore data' },
        ],
    },
];

// Mock update data for demo purposes
const MOCK_UPDATES = [
    {
        version: '1.1.0',
        date: '2026-02-01',
        type: 'minor',
        title: 'Performance Improvements',
        size: '2.5 MB',
        changes: [
            { type: 'feature', text: 'Export laporan ke PDF' },
            { type: 'feature', text: 'Dashboard real-time updates' },
            { type: 'improvement', text: 'Optimasi loading time' },
            { type: 'fix', text: 'Perbaikan bug kalkulasi COGS' },
        ],
    },
];

/**
 * Get current application version
 * @returns {string} Current version
 */
export const getCurrentVersion = () => {
    return APP_VERSION;
};

/**
 * Get full changelog
 * @returns {Array} Changelog entries
 */
export const getChangelog = () => {
    return CHANGELOG;
};

/**
 * Get latest changelog entry
 * @returns {Object} Latest changelog
 */
export const getLatestChangelog = () => {
    return CHANGELOG[0];
};

/**
 * Check for available updates (mock implementation)
 * @returns {Promise<{ hasUpdate: boolean, updateInfo: Object|null }>}
 */
export const checkForUpdates = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo, randomly decide if there's an update
    const hasUpdate = Math.random() > 0.5;

    return {
        hasUpdate,
        updateInfo: hasUpdate ? MOCK_UPDATES[0] : null,
        checkedAt: new Date().toISOString(),
    };
};

/**
 * Apply update (mock implementation)
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const applyUpdate = async (onProgress) => {
    // Simulate update process with progress
    const steps = [
        { progress: 10, status: 'Downloading update...' },
        { progress: 30, status: 'Verifying package...' },
        { progress: 50, status: 'Backing up data...' },
        { progress: 70, status: 'Installing update...' },
        { progress: 90, status: 'Finalizing...' },
        { progress: 100, status: 'Complete!' },
    ];

    for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        if (onProgress) {
            onProgress(step.progress, step.status);
        }
    }

    return {
        success: true,
        message: 'Update berhasil diinstall. Silakan refresh halaman.',
    };
};

/**
 * Get update history from localStorage
 * @returns {Array} Update history
 */
export const getUpdateHistory = () => {
    try {
        const history = localStorage.getItem('update_history');
        return history ? JSON.parse(history) : [];
    } catch {
        return [];
    }
};

/**
 * Record update to history
 * @param {Object} updateInfo - Update information
 */
export const recordUpdate = (updateInfo) => {
    const history = getUpdateHistory();
    history.unshift({
        ...updateInfo,
        installedAt: new Date().toISOString(),
    });
    localStorage.setItem('update_history', JSON.stringify(history.slice(0, 10)));
};

/**
 * Get system info for about section
 * @returns {Object} System information
 */
export const getSystemInfo = () => {
    return {
        appName: 'ERP Daya Padi',
        version: APP_VERSION,
        buildDate: '2026-01-12',
        environment: import.meta.env.MODE || 'development',
        storage: 'localStorage',
        framework: 'React 19 + Vite 7',
    };
};

/**
 * Get change type badge color
 * @param {string} type - Change type (feature, improvement, fix, breaking)
 * @returns {string} Badge color class
 */
export const getChangeTypeBadge = (type) => {
    const badges = {
        feature: { bg: 'bg-green-100', text: 'text-green-800', label: 'Fitur' },
        improvement: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Perbaikan' },
        fix: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Bug Fix' },
        breaking: { bg: 'bg-red-100', text: 'text-red-800', label: 'Breaking' },
    };
    return badges[type] || badges.feature;
};
