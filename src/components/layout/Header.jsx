import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Bell,
    Search,
    Globe,
    LogOut,
    User,
    ChevronDown,
    Moon,
    Sun,
    Menu,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import FactorySelector from '@/components/shared/FactorySelector';

const Header = ({ onMenuClick }) => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const toggleLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
        setShowLangMenu(false);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
    };

    return (
        <header className="h-[var(--header-height)] bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 mr-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('common.search') + '...'}
                        className={cn(
                            'w-full h-10 pl-10 pr-4 rounded-lg',
                            'bg-gray-50 border border-gray-200 text-sm text-gray-900',
                            'placeholder:text-gray-400',
                            'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
                            'transition-all duration-200'
                        )}
                    />
                </div>
            </div>

            {/* Factory Selector */}
            <div className="hidden md:block mx-4">
                <FactorySelector />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        'text-gray-600 hover:text-gray-900',
                        'hover:bg-gray-100 transition-colors duration-200'
                    )}
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Language Selector */}
                <div className="relative">
                    <button
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        className={cn(
                            'h-10 px-3 rounded-lg flex items-center gap-2',
                            'text-gray-600 hover:text-gray-900',
                            'hover:bg-gray-100 transition-colors duration-200'
                        )}
                    >
                        <Globe className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase">{i18n.language}</span>
                    </button>

                    {showLangMenu && (
                        <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] animate-scale-in">
                            <button
                                onClick={() => toggleLanguage('id')}
                                className={cn(
                                    'w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors',
                                    i18n.language === 'id' && 'text-emerald-600 font-medium bg-emerald-50'
                                )}
                            >
                                🇮🇩 Indonesia
                            </button>
                            <button
                                onClick={() => toggleLanguage('en')}
                                className={cn(
                                    'w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors',
                                    i18n.language === 'en' && 'text-emerald-600 font-medium bg-emerald-50'
                                )}
                            >
                                🇺🇸 English
                            </button>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <button
                    className={cn(
                        'relative w-10 h-10 rounded-lg flex items-center justify-center',
                        'text-gray-600 hover:text-gray-900',
                        'hover:bg-gray-100 transition-colors duration-200'
                    )}
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* User Menu */}
                <div className="relative ml-2">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={cn(
                            'flex items-center gap-3 h-10 pl-3 pr-2 rounded-lg',
                            'hover:bg-gray-100 transition-colors duration-200'
                        )}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium text-sm">
                            {user?.name?.charAt(0)}
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px] animate-scale-in">
                            <div className="px-4 py-2 border-b border-gray-200">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                {t('common.logout')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Click outside handler */}
            {(showUserMenu || showLangMenu) && (
                <div
                    className="fixed inset-0 z-[-1]"
                    onClick={() => {
                        setShowUserMenu(false);
                        setShowLangMenu(false);
                    }}
                />
            )}
        </header>
    );
};

export default Header;
