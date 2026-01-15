import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DoubleSidebar from './DoubleSidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

const DashboardShell = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const [secondSidebarCollapsed, setSecondSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[var(--color-bg-light)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[var(--color-text-secondary)]">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DoubleSidebar
                collapsed={secondSidebarCollapsed}
                setCollapsed={setSecondSidebarCollapsed}
                mobileOpen={mobileMenuOpen}
                setMobileOpen={setMobileMenuOpen}
            />

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <div
                className={cn(
                    'transition-all duration-300 ease-in-out min-h-screen',
                    // Desktop styles
                    'lg:ml-24',
                    !secondSidebarCollapsed && 'lg:ml-96',
                    // Mobile styles
                    'ml-0'
                )}
            >
                <Header onMenuClick={() => setMobileMenuOpen(true)} />

                <main className="p-4 md:p-6 min-h-[calc(100vh-var(--header-height))]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardShell;
