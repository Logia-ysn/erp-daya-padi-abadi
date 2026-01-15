import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Globe, User, Database, Download, Upload, RefreshCw,
    CheckCircle, AlertTriangle, Info, History, Package
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label, Modal } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
    exportBackup,
    importBackup,
    getLastBackupInfo,
    getStorageStats
} from '@/services/backupService';
import {
    getCurrentVersion,
    checkForUpdates,
    getChangelog,
    getSystemInfo,
    getChangeTypeBadge
} from '@/services/updateService';

const SettingsPage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    // Backup state
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [backupMessage, setBackupMessage] = useState(null);
    const [lastBackup, setLastBackup] = useState(getLastBackupInfo());
    const [storageStats, setStorageStats] = useState(getStorageStats());

    // Update state
    const [isChecking, setIsChecking] = useState(false);
    const [updateInfo, setUpdateInfo] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateProgress, setUpdateProgress] = useState(0);
    const [updateStatus, setUpdateStatus] = useState('');
    const [showChangelog, setShowChangelog] = useState(false);

    // System info
    const systemInfo = getSystemInfo();
    const changelog = getChangelog();

    // Handle backup export
    const handleExportBackup = async () => {
        setIsExporting(true);
        setBackupMessage(null);
        try {
            await new Promise(r => setTimeout(r, 500)); // Small delay for UX
            exportBackup();
            setLastBackup(getLastBackupInfo());
            setBackupMessage({ type: 'success', text: t('settings.backup.exportSuccess') });
        } catch (error) {
            setBackupMessage({ type: 'error', text: error.message });
        } finally {
            setIsExporting(false);
        }
    };

    // Handle backup import
    const handleImportBackup = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        setBackupMessage(null);
        try {
            const result = await importBackup(file);
            setBackupMessage({ type: 'success', text: result.message });
            setStorageStats(getStorageStats());
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            setBackupMessage({ type: 'error', text: error.message });
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Handle check for updates
    const handleCheckUpdates = async () => {
        setIsChecking(true);
        setUpdateInfo(null);
        try {
            const result = await checkForUpdates();
            setUpdateInfo(result);
        } finally {
            setIsChecking(false);
        }
    };

    // Handle install update (mock)
    const handleInstallUpdate = async () => {
        setIsUpdating(true);
        setUpdateProgress(0);

        const steps = [
            { progress: 10, status: 'Mengunduh pembaruan...' },
            { progress: 30, status: 'Memverifikasi paket...' },
            { progress: 50, status: 'Backup data...' },
            { progress: 70, status: 'Menginstall pembaruan...' },
            { progress: 90, status: 'Finalisasi...' },
            { progress: 100, status: 'Selesai!' },
        ];

        for (const step of steps) {
            await new Promise(r => setTimeout(r, 800));
            setUpdateProgress(step.progress);
            setUpdateStatus(step.status);
        }

        setTimeout(() => {
            setIsUpdating(false);
            setUpdateInfo(null);
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('settings.title')}</h1>
                <p className="text-[var(--color-text-secondary)] mt-1">{t('settings.subtitle')}</p>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />{t('settings.profile')}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-2xl font-bold">{user?.name?.charAt(0)}</div>
                        <div><p className="font-medium text-lg">{user?.name}</p><p className="text-[var(--color-text-secondary)]">{user?.email}</p><p className="text-sm text-[var(--color-primary)] capitalize">{user?.role}</p></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div><Label>{t('settings.fullName')}</Label><Input defaultValue={user?.name} /></div>
                        <div><Label>{t('settings.email')}</Label><Input defaultValue={user?.email} type="email" /></div>
                    </div>
                    <Button>{t('settings.saveChanges')}</Button>
                </CardContent>
            </Card>

            {/* Language Card */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />{t('settings.language')}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-3">
                        <button onClick={() => { i18n.changeLanguage('id'); localStorage.setItem('language', 'id'); }} className={cn('flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all', i18n.language === 'id' ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-[var(--color-border)]')}>
                            <span className="text-2xl">🇮🇩</span><div className="text-left"><p className="font-medium">Bahasa Indonesia</p><p className="text-sm text-[var(--color-text-secondary)]">Indonesian</p></div>
                        </button>
                        <button onClick={() => { i18n.changeLanguage('en'); localStorage.setItem('language', 'en'); }} className={cn('flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all', i18n.language === 'en' ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-[var(--color-border)]')}>
                            <span className="text-2xl">🇺🇸</span><div className="text-left"><p className="font-medium">English</p><p className="text-sm text-[var(--color-text-secondary)]">US English</p></div>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Backup & Restore Card */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" />{t('settings.backup.title')}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-[var(--color-text-secondary)]">{t('settings.backup.description')}</p>

                    {/* Storage Stats */}
                    <div className="flex items-center gap-6 p-3 bg-[var(--color-bg-secondary)] rounded-lg">
                        <div>
                            <p className="text-xs text-[var(--color-text-secondary)]">{t('settings.backup.storageUsed')}</p>
                            <p className="font-semibold text-[var(--color-primary)]">{storageStats.totalSizeFormatted}</p>
                        </div>
                        <div className="h-8 w-px bg-[var(--color-border)]" />
                        <div>
                            <p className="text-xs text-[var(--color-text-secondary)]">{t('settings.backup.lastBackup')}</p>
                            <p className="font-semibold">{lastBackup ? new Date(lastBackup.date).toLocaleDateString('id-ID') : t('settings.backup.never')}</p>
                        </div>
                    </div>

                    {/* Backup Message */}
                    {backupMessage && (
                        <div className={cn('flex items-center gap-2 p-3 rounded-lg', backupMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
                            {backupMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            <span className="text-sm">{backupMessage.text}</span>
                        </div>
                    )}

                    {/* Warning */}
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg text-yellow-800">
                        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                        <span className="text-sm">{t('settings.backup.restoreWarning')}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button onClick={handleExportBackup} disabled={isExporting} className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            {isExporting ? 'Exporting...' : t('settings.backup.export')}
                        </Button>
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            {isImporting ? 'Importing...' : t('settings.backup.import')}
                        </Button>
                        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                    </div>
                </CardContent>
            </Card>

            {/* System Update Card */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" />{t('settings.update.title')}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {/* Version Info */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[var(--color-primary-light)] to-transparent rounded-lg">
                        <div>
                            <p className="text-sm text-[var(--color-text-secondary)]">{t('settings.update.currentVersion')}</p>
                            <p className="text-2xl font-bold text-[var(--color-primary)]">v{getCurrentVersion()}</p>
                        </div>
                        <div className="text-right text-sm text-[var(--color-text-secondary)]">
                            <p>{t('settings.update.buildDate')}: {systemInfo.buildDate}</p>
                            <p>{t('settings.update.environment')}: {systemInfo.environment}</p>
                        </div>
                    </div>

                    {/* Update Status */}
                    {updateInfo && (
                        <div className={cn('p-4 rounded-lg', updateInfo.hasUpdate ? 'bg-blue-50' : 'bg-green-50')}>
                            {updateInfo.hasUpdate ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-blue-700">
                                        <Info className="w-5 h-5" />
                                        <span className="font-medium">{t('settings.update.updateAvailable')}: v{updateInfo.updateInfo.version}</span>
                                    </div>
                                    <p className="text-sm text-blue-600">{updateInfo.updateInfo.title}</p>
                                    {isUpdating ? (
                                        <div className="space-y-2">
                                            <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${updateProgress}%` }} />
                                            </div>
                                            <p className="text-sm text-blue-700">{updateStatus}</p>
                                        </div>
                                    ) : (
                                        <Button onClick={handleInstallUpdate} className="bg-blue-600 hover:bg-blue-700">
                                            {t('settings.update.install')}
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-green-700">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">{t('settings.update.noUpdates')}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button onClick={handleCheckUpdates} disabled={isChecking || isUpdating} className="flex items-center gap-2">
                            <RefreshCw className={cn('w-4 h-4', isChecking && 'animate-spin')} />
                            {isChecking ? t('settings.update.checking') : t('settings.update.checkUpdates')}
                        </Button>
                        <Button variant="outline" onClick={() => setShowChangelog(true)} className="flex items-center gap-2">
                            <History className="w-4 h-4" />
                            {t('settings.update.viewChangelog')}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Data & Storage Card */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" />{t('settings.data.title')}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-[var(--color-text-secondary)]">{t('settings.data.description')}</p>
                    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg text-red-800">
                        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                        <span className="text-sm">{t('settings.data.clearWarning')}</span>
                    </div>
                    <Button variant="destructive" onClick={() => { localStorage.clear(); window.location.reload(); }}>{t('settings.data.clearAll')}</Button>
                </CardContent>
            </Card>

            {/* Changelog Modal */}
            <Modal isOpen={showChangelog} onClose={() => setShowChangelog(false)} title={t('settings.update.changelog')} size="lg">
                <div className="space-y-6 max-h-96 overflow-y-auto">
                    {changelog.map((release, idx) => (
                        <div key={idx} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-[var(--color-primary)]">v{release.version}</span>
                                <span className="text-sm text-[var(--color-text-secondary)]">{release.date}</span>
                                <span className={cn('px-2 py-0.5 text-xs rounded-full', release.type === 'major' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800')}>
                                    {release.type}
                                </span>
                            </div>
                            <p className="font-medium text-[var(--color-text-primary)]">{release.title}</p>
                            <ul className="space-y-2">
                                {release.changes.map((change, cIdx) => {
                                    const badge = getChangeTypeBadge(change.type);
                                    return (
                                        <li key={cIdx} className="flex items-start gap-2 text-sm">
                                            <span className={cn('px-1.5 py-0.5 text-xs rounded', badge.bg, badge.text)}>{badge.label}</span>
                                            <span>{change.text}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default SettingsPage;
