/**
 * Backup & Restore Service
 * Handles data export/import for ERP system
 */

import { STORAGE_KEYS } from './api';

// Additional keys to backup
const ADDITIONAL_KEYS = ['auth_user', 'language', 'last_backup'];

// All keys that should be backed up
const ALL_BACKUP_KEYS = [...Object.values(STORAGE_KEYS), ...ADDITIONAL_KEYS];

/**
 * Get all data from localStorage for backup
 * @returns {Object} All ERP data
 */
export const getAllData = () => {
    const data = {};
    ALL_BACKUP_KEYS.forEach(key => {
        try {
            const item = localStorage.getItem(key);
            if (item) {
                data[key] = JSON.parse(item);
            }
        } catch (e) {
            console.warn(`Failed to get ${key}:`, e);
        }
    });
    return data;
};

/**
 * Export all data as a downloadable JSON file
 * @returns {void}
 */
export const exportBackup = () => {
    const data = getAllData();
    const backupData = {
        version: APP_VERSION,
        exportDate: new Date().toISOString(),
        data,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `erp-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Record last backup date
    localStorage.setItem('last_backup', JSON.stringify({
        date: new Date().toISOString(),
        itemCount: Object.keys(data).length,
    }));
};

/**
 * Validate backup file structure
 * @param {Object} backupData - Parsed backup data
 * @returns {{ valid: boolean, errors: string[] }}
 */
export const validateBackup = (backupData) => {
    const errors = [];

    if (!backupData) {
        errors.push('File backup kosong atau tidak valid');
        return { valid: false, errors };
    }

    if (!backupData.version) {
        errors.push('Versi backup tidak ditemukan');
    }

    if (!backupData.exportDate) {
        errors.push('Tanggal ekspor tidak ditemukan');
    }

    if (!backupData.data || typeof backupData.data !== 'object') {
        errors.push('Data backup tidak valid');
    }

    return { valid: errors.length === 0, errors };
};

/**
 * Import and restore data from backup file
 * @param {File} file - Backup JSON file
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const importBackup = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const backupData = JSON.parse(e.target.result);
                const validation = validateBackup(backupData);

                if (!validation.valid) {
                    reject({ success: false, message: validation.errors.join(', ') });
                    return;
                }

                // Clear existing data first
                ALL_BACKUP_KEYS.forEach(key => {
                    localStorage.removeItem(key);
                });

                // Restore data
                Object.entries(backupData.data).forEach(([key, value]) => {
                    localStorage.setItem(key, JSON.stringify(value));
                });

                // Record restore info
                localStorage.setItem('last_restore', JSON.stringify({
                    date: new Date().toISOString(),
                    fromVersion: backupData.version,
                    backupDate: backupData.exportDate,
                }));

                resolve({
                    success: true,
                    message: `Data berhasil direstore dari backup tanggal ${new Date(backupData.exportDate).toLocaleDateString('id-ID')}`,
                });
            } catch (error) {
                reject({ success: false, message: 'File tidak dapat dibaca atau format tidak valid' });
            }
        };

        reader.onerror = () => {
            reject({ success: false, message: 'Gagal membaca file' });
        };

        reader.readAsText(file);
    });
};

/**
 * Get last backup info
 * @returns {Object|null} Last backup metadata
 */
export const getLastBackupInfo = () => {
    try {
        const info = localStorage.getItem('last_backup');
        return info ? JSON.parse(info) : null;
    } catch {
        return null;
    }
};

/**
 * Get storage usage statistics
 * @returns {Object} Storage stats
 */
export const getStorageStats = () => {
    let totalSize = 0;
    const entityCounts = {};

    ALL_BACKUP_KEYS.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
            totalSize += item.length * 2; // Approximate bytes (UTF-16)
            try {
                const parsed = JSON.parse(item);
                if (Array.isArray(parsed)) {
                    entityCounts[key] = parsed.length;
                }
            } catch {
                // Skip non-array items
            }
        }
    });

    return {
        totalSize,
        totalSizeFormatted: formatBytes(totalSize),
        entityCounts,
    };
};

/**
 * Format bytes to human readable string
 * @param {number} bytes 
 * @returns {string}
 */
const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// App version constant
export const APP_VERSION = '1.0.0';
