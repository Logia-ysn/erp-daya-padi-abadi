import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Factory,
    TrendingUp,
    DollarSign,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Activity,
    Clock,
    AlertCircle,
    BarChart3,
    Package,
    Wrench,
    Calculator,
    Receipt,
    FileText,
    UserCheck,
    Wallet,
    PieChart,
    CalendarClock,
    Target,
    UsersRound
} from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const [expandedModules, setExpandedModules] = useState({
        production: true,
        sales: false,
        finance: false,
        hrd: false,
    });

    const toggleModule = (module) => {
        setExpandedModules(prev => ({
            ...prev,
            [module]: !prev[module]
        }));
    };

    // Dashboard (standalone)
    const dashboardItem = { path: '/', icon: LayoutDashboard, label: t('nav.dashboard') };

    // Module structure with sub-menus
    const modules = [
        {
            id: 'production',
            label: t('nav.productionModule'),
            icon: Factory,
            subItems: [
                { path: '/production/worksheet', icon: FileText, label: 'Worksheet' },
                { path: '/production/performance', icon: Activity, label: t('nav.performance') },
                { path: '/production/uptime', icon: Clock, label: t('nav.upTime') },
                { path: '/production/downtime', icon: AlertCircle, label: t('nav.downTime') },
                { path: '/production/oee', icon: BarChart3, label: t('nav.oee') },
                { path: '/production/stock', icon: Package, label: t('nav.stockManagement') },
                { path: '/production/maintenance', icon: Wrench, label: t('nav.maintenance') },
                { path: '/production/cogm', icon: Calculator, label: t('nav.hppCogm') },
            ]
        },
        {
            id: 'sales',
            label: t('nav.salesModule'),
            icon: TrendingUp,
            subItems: [
                { path: '/sales/revenue', icon: TrendingUp, label: t('nav.revenue') },
                { path: '/sales/invoices', icon: FileText, label: t('nav.invoiceTracker') },
                { path: '/sales/pic', icon: UserCheck, label: t('nav.pic') },
            ]
        },
        {
            id: 'finance',
            label: t('nav.financeModule'),
            icon: DollarSign,
            subItems: [
                { path: '/finance/expenses', icon: Wallet, label: t('nav.dailyExpenses') },
                { path: '/finance/cogm-analysis', icon: PieChart, label: t('nav.cogmAnalysis') },
            ]
        },
        {
            id: 'hrd',
            label: t('nav.hrdModule'),
            icon: Users,
            subItems: [
                { path: '/hrd/attendance', icon: CalendarClock, label: t('nav.attendance') },
                { path: '/hrd/performance', icon: Target, label: t('nav.hrdPerformance') },
                { path: '/hrd/demography', icon: UsersRound, label: t('nav.demography') },
            ]
        },
    ];

    const bottomItems = [
        { path: '/settings', icon: Settings, label: t('nav.settings') },
    ];

    // Single nav item component
    const NavItem = ({ item, isSubItem = false }) => {
        const isActive = location.pathname === item.path;
        return (
            <NavLink
                to={item.path}
                className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group',
                    isSubItem && 'pl-10',
                    isActive
                        ? 'bg-white/15 text-white font-medium shadow-sm'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
            >
                <item.icon className={cn('w-4 h-4 flex-shrink-0', isActive && 'text-[var(--color-secondary)]')} />
                {!isCollapsed && (
                    <span className="truncate text-sm">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] ml-auto" />
                )}
            </NavLink>
        );
    };

    // Module header with expand/collapse
    const ModuleHeader = ({ module }) => {
        const isExpanded = expandedModules[module.id];
        const hasActiveChild = module.subItems.some(item => location.pathname === item.path || location.pathname.startsWith(item.path.split('/').slice(0, 3).join('/')));

        return (
            <div className="mb-1">
                <button
                    onClick={() => toggleModule(module.id)}
                    className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200',
                        hasActiveChild
                            ? 'bg-white/10 text-white'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                    )}
                >
                    <module.icon className={cn('w-5 h-5 flex-shrink-0', hasActiveChild && 'text-[var(--color-secondary)]')} />
                    {!isCollapsed && (
                        <>
                            <span className="flex-1 text-left text-sm font-medium truncate">{module.label}</span>
                            <ChevronDown className={cn(
                                'w-4 h-4 transition-transform duration-200',
                                isExpanded && 'rotate-180'
                            )} />
                        </>
                    )}
                </button>

                {/* Sub-items */}
                {!isCollapsed && isExpanded && (
                    <div className="mt-1 space-y-0.5 animate-fade-in">
                        {module.subItems.map((item) => (
                            <NavItem key={item.path} item={item} isSubItem />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 h-screen gradient-sidebar flex flex-col transition-all duration-300 z-40 shadow-xl',
                isCollapsed ? 'w-[var(--sidebar-collapsed)]' : 'w-[var(--sidebar-width)]'
            )}
        >
            {/* Logo Section */}
            <div className="p-4 border-b border-white/10">
                <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden">
                        <img src={logo} alt="Daya Padi Abadi" className="w-9 h-9 object-contain" />
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h1 className="font-bold text-white text-lg leading-tight">Daya Padi</h1>
                            <p className="text-xs text-white/60">ERP System</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
                {/* Dashboard */}
                <NavItem item={dashboardItem} />

                {/* Divider */}
                <div className="h-px bg-white/10 my-2" />

                {/* Modules */}
                {modules.map((module) => (
                    <ModuleHeader key={module.id} module={module} />
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t border-white/10 space-y-1">
                {bottomItems.map((item) => (
                    <NavItem key={item.path} item={item} />
                ))}
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center text-[var(--color-primary)] hover:bg-gray-100 transition-colors"
            >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </aside>
    );
};

export default Sidebar;
