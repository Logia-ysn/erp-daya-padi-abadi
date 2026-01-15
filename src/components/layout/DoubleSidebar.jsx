import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Factory,
    TrendingUp,
    DollarSign,
    Users,
    Settings,
    Search,
    Calendar,
    FileText,
    Activity,
    Clock,
    AlertCircle,
    BarChart3,
    Package,
    Wrench,
    Calculator,
    Receipt,
    UserCheck,
    Wallet,
    PieChart,
    CalendarClock,
    Target,
    UsersRound,
    ChevronLeft,
    ChevronRight,
    X,
    ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

const DoubleSidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);

    // Reset mobile submenu when sidebar closes
    useEffect(() => {
        if (!mobileOpen) setMobileSubmenuOpen(false);
    }, [mobileOpen]);

    // Determine active module based on current path
    const determineActiveModule = () => {
        const path = location.pathname;
        if (path === '/') return 'dashboard';
        if (path.startsWith('/production')) return 'production';
        if (path.startsWith('/sales')) return 'sales';
        if (path.startsWith('/finance')) return 'finance';
        if (path.startsWith('/hrd')) return 'hrd';
        return 'dashboard';
    };

    const activeModule = determineActiveModule();

    // Main modules for icon sidebar
    const mainModules = [
        { id: 'dashboard', icon: LayoutDashboard, label: t('nav.dashboard'), path: '/' },
        { id: 'search', icon: Search, label: 'Search', path: null },
        { id: 'calendar', icon: Calendar, label: 'Calendar', path: null },
        { id: 'production', icon: Factory, label: t('nav.productionModule'), path: '/production/worksheet' },
        { id: 'sales', icon: TrendingUp, label: t('nav.salesModule'), path: '/sales/revenue' },
        { id: 'finance', icon: DollarSign, label: t('nav.financeModule'), path: '/finance/expenses' },
        { id: 'hrd', icon: Users, label: t('nav.hrdModule'), path: '/hrd/attendance' },
    ];

    // Sub-navigation for each module
    const moduleNavigation = {
        dashboard: {
            title: 'Dashboard',
            sections: [
                {
                    title: 'OVERVIEW',
                    items: [
                        { path: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
                    ]
                },
                {
                    title: 'QUICK ACTIONS',
                    items: [
                        { path: '/production/worksheet', icon: FileText, label: 'Input Worksheet' },
                        { path: '/production/stock', icon: Package, label: 'Manajemen Stok' },
                        { path: '/finance/expenses', icon: Wallet, label: 'Input Pengeluaran' },
                        { path: '/hrd/attendance', icon: CalendarClock, label: 'Input Kehadiran' },
                        { path: '/sales/revenue', icon: TrendingUp, label: 'Input Penjualan' },
                    ]
                }
            ]
        },
        production: {
            title: t('nav.productionModule'),
            sections: [
                {
                    title: 'PRODUCTION',
                    items: [
                        { path: '/production/worksheet', icon: FileText, label: 'Worksheet' },
                        { path: '/production/performance', icon: Activity, label: t('nav.performance') },
                        { path: '/production/uptime', icon: Clock, label: t('nav.upTime') },
                        { path: '/production/downtime', icon: AlertCircle, label: t('nav.downTime') },
                        { path: '/production/oee', icon: BarChart3, label: t('nav.oee') },
                    ]
                },
                {
                    title: 'INVENTORY',
                    items: [
                        { path: '/production/stock', icon: Package, label: t('nav.stockManagement') },
                        { path: '/production/maintenance', icon: Wrench, label: t('nav.maintenance') },
                        { path: '/production/cogm', icon: Calculator, label: t('nav.hppCogm') },
                    ]
                }
            ]
        },
        sales: {
            title: t('nav.salesModule'),
            sections: [
                {
                    title: 'SALES',
                    items: [
                        { path: '/sales/revenue', icon: TrendingUp, label: t('nav.revenue') },
                        { path: '/sales/invoices', icon: FileText, label: t('nav.invoiceTracker') },
                        { path: '/sales/pic', icon: UserCheck, label: t('nav.pic') },
                    ]
                }
            ]
        },
        finance: {
            title: t('nav.financeModule'),
            sections: [
                {
                    title: 'FINANCE',
                    items: [
                        { path: '/finance/expenses', icon: Wallet, label: t('nav.dailyExpenses') },
                        { path: '/finance/cogm-analysis', icon: PieChart, label: t('nav.cogmAnalysis') },
                    ]
                }
            ]
        },
        hrd: {
            title: t('nav.hrdModule'),
            sections: [
                {
                    title: 'HUMAN RESOURCES',
                    items: [
                        { path: '/hrd/attendance', icon: CalendarClock, label: t('nav.attendance') },
                        { path: '/hrd/performance', icon: Target, label: t('nav.hrdPerformance') },
                        { path: '/hrd/demography', icon: UsersRound, label: t('nav.demography') },
                    ]
                }
            ]
        },
    };

    return (
        <>
            {/* Icon Sidebar (Left) - Level 1 Nav (Drawer) on Mobile */}
            <aside
                className={cn(
                    'fixed top-0 h-screen bg-white flex flex-col items-center py-6 z-50 border-r border-gray-200 shadow-sm transition-all duration-300',
                    'lg:left-0 lg:w-24',
                    mobileOpen && !mobileSubmenuOpen ? 'left-0 w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Logo */}
                <div className="mb-8 relative w-full flex justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm overflow-hidden">
                        <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
                    </div>
                </div>

                {/* Main Module Icons */}
                <nav className="flex-1 flex flex-col items-center gap-2 w-full px-3 overflow-y-auto">
                    {/* Header for Mobile Level 1 */}
                    <div className="lg:hidden w-full px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Modules
                    </div>

                    {mainModules.map((module) => {
                        const isActive = activeModule === module.id;
                        return (
                            <NavLink
                                key={module.id}
                                to={module.path || '#'}
                                onClick={(e) => {
                                    if (!module.path) {
                                        e.preventDefault();
                                    } else if (window.innerWidth < 1024) {
                                        setMobileSubmenuOpen(true);
                                    }
                                }}
                                className={cn(
                                    'w-full rounded-2xl flex items-center transition-all duration-200 group relative',
                                    'lg:aspect-square lg:justify-center lg:p-0',
                                    'p-3 gap-3',
                                    isActive
                                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                )}
                                title={module.label}
                            >
                                <module.icon className={cn(
                                    'w-7 h-7 transition-colors flex-shrink-0',
                                    isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'
                                )} />

                                {/* Label: Visible on Mobile Only */}
                                <span className={cn(
                                    "text-sm font-medium lg:hidden",
                                    isActive ? 'text-white' : 'text-gray-700'
                                )}>
                                    {module.label}
                                </span>

                                {/* Active indicator (Desktop) */}
                                {isActive && (
                                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-l-full" />
                                )}

                                {/* Arrow indicator (Mobile) */}
                                <div className="lg:hidden ml-auto">
                                    <ChevronRight className={cn("w-4 h-4", isActive ? 'text-white' : 'text-gray-400')} />
                                </div>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Settings at bottom */}
                <NavLink
                    to="/settings"
                    onClick={() => { if (window.innerWidth < 1024) setMobileOpen(false); }}
                    className={cn(
                        'w-full rounded-2xl flex items-center transition-all duration-200 group mx-3',
                        // Desktop
                        'lg:aspect-square lg:justify-center lg:p-0 lg:w-auto lg:mx-3',
                        // Mobile
                        'p-3 gap-3 w-[calc(100%-1.5rem)]',
                        location.pathname === '/settings'
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30'
                            : 'bg-gray-50 hover:bg-gray-100'
                    )}
                >
                    <Settings className={cn(
                        'w-7 h-7 transition-colors',
                        location.pathname === '/settings' ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'
                    )} />
                    <span className={cn(
                        "text-sm font-medium lg:hidden",
                        location.pathname === '/settings' ? 'text-white' : 'text-gray-700'
                    )}>
                        Settings
                    </span>
                </NavLink>
            </aside>

            {/* Navigation Sidebar (Second) - Level 2 Nav (Submenu) on Mobile */}
            <aside
                className={cn(
                    'fixed top-0 h-screen bg-white flex flex-col z-40 border-r border-gray-200 transition-all duration-300 shadow-sm',
                    // Desktop Positioning: Fixed at left-24
                    'lg:left-24 lg:translate-x-0',
                    // Mobile Positioning: Fixed at left-0 (Overlaps Level 1)
                    'left-0',
                    // Mobile Visibility: Show only if mobileOpen AND mobileSubmenuOpen
                    mobileOpen && mobileSubmenuOpen ? 'translate-x-0 w-64' : '-translate-x-full',
                    // Desktop Collapse Logic
                    collapsed ? 'lg:w-0 lg:opacity-0' : 'lg:w-64 xl:w-72 lg:opacity-100'
                )}
            >
                {(moduleNavigation[activeModule]) && (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Desktop Collapse Button */}
                                <button
                                    onClick={() => setCollapsed(true)}
                                    className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>

                                {/* Mobile Back Button */}
                                <button
                                    onClick={() => setMobileSubmenuOpen(false)}
                                    className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium text-gray-600"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </button>

                                <h2 className="text-xl font-semibold text-gray-900 truncate max-w-[160px] hidden lg:block">
                                    {moduleNavigation[activeModule].title}
                                </h2>
                            </div>

                            {/* Mobile Close Button */}
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Mobile Title (shown below header for space) */}
                        <div className="lg:hidden px-6 py-2 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-900">
                                {moduleNavigation[activeModule].title}
                            </h2>
                        </div>

                        {/* Navigation Items */}
                        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                            {moduleNavigation[activeModule].sections ? (
                                moduleNavigation[activeModule].sections.map((section, idx) => (
                                    <div key={idx}>
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                                            {section.title}
                                        </h3>
                                        <div className="space-y-1">
                                            {section.items.map((item) => {
                                                const isActive = location.pathname === item.path;
                                                return (
                                                    <NavLink
                                                        key={item.path}
                                                        to={item.path}
                                                        onClick={() => setMobileOpen(false)} // Close entirely on selection
                                                        className={cn(
                                                            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                                                            isActive
                                                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                        )}
                                                    >
                                                        <item.icon className={cn(
                                                            'w-5 h-5 flex-shrink-0',
                                                            isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                                                        )} />
                                                        <span className="text-sm font-medium">{item.label}</span>
                                                    </NavLink>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="space-y-1">
                                    {moduleNavigation[activeModule].items?.map((item) => {
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setMobileOpen(false)}
                                                className={cn(
                                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                                                    isActive
                                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                )}
                                            >
                                                <item.icon className={cn(
                                                    'w-5 h-5 flex-shrink-0',
                                                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                                                )} />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            )}
                        </nav>
                    </>
                )}
            </aside>

            {/* Expand button when second sidebar is collapsed (Desktop) */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    className="hidden lg:flex fixed left-24 top-20 z-40 p-2 bg-white rounded-r-lg border border-l-0 border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            )}
        </>
    );
};

export default DoubleSidebar;
