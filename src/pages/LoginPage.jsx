import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, Mail, Leaf } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Label } from '@/components/ui';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

const LoginPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { login, user } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(email, password);
            if (success) navigate('/');
            else setError(t('login.invalidCredentials'));
        } catch (err) {
            setError(t('login.invalidCredentials'));
        } finally {
            setLoading(false);
        }
    };

    const demoAccounts = [
        { role: 'Admin', email: 'admin@dayapadi.com', password: 'admin123' },
        { role: 'Manager', email: 'manager@dayapadi.com', password: 'manager123' },
        { role: 'Operator', email: 'operator@dayapadi.com', password: 'operator123' },
        { role: 'Finance', email: 'finance@dayapadi.com', password: 'finance123' },
    ];

    const fillDemo = (account) => {
        setEmail(account.email);
        setPassword(account.password);
        setError('');
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
                    <div className="w-24 h-24 rounded-2xl bg-white shadow-2xl flex items-center justify-center mb-8">
                        <img src={logo} alt="Daya Padi Abadi" className="w-20 h-20 object-contain" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Daya Padi Abadi</h1>
                    <p className="text-xl text-white/80 mb-12">ERP Manufacturing System</p>

                    <div className="space-y-6 max-w-sm">
                        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] flex items-center justify-center flex-shrink-0"><Leaf className="w-5 h-5 text-white" /></div>
                            <div><h3 className="font-semibold">Production Management</h3><p className="text-sm text-white/70">Track pelletizing, yields, and packing in real-time</p></div>
                        </div>
                        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] flex items-center justify-center flex-shrink-0"><Lock className="w-5 h-5 text-white" /></div>
                            <div><h3 className="font-semibold">Inventory Control</h3><p className="text-sm text-white/70">Manage raw materials, WIP, and finished goods</p></div>
                        </div>
                        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-white" /></div>
                            <div><h3 className="font-semibold">Maintenance Tracking</h3><p className="text-sm text-white/70">Monitor machine hours and schedule services</p></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[var(--color-bg-light)]">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-xl bg-white shadow-lg flex items-center justify-center mb-4">
                            <img src={logo} alt="Daya Padi Abadi" className="w-14 h-14 object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Daya Padi Abadi</h1>
                    </div>

                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('login.welcome')}</h2>
                        <p className="text-[var(--color-text-secondary)] mt-1">{t('login.signIn')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <Label htmlFor="email">{t('login.email')}</Label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="name@company.com" required />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">{t('login.password')}</Label>
                                <a href="#" className="text-sm text-[var(--color-primary)] hover:underline">{t('login.forgotPassword')}</a>
                            </div>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
                                <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" placeholder="••••••••" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text-secondary)]">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                            <label htmlFor="remember" className="ml-2 text-sm text-[var(--color-text-secondary)]">{t('login.rememberMe')}</label>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
                        )}

                        <Button type="submit" className="w-full" loading={loading}>{t('login.signInButton')}</Button>
                    </form>

                    {/* Demo Accounts */}
                    <div className="mt-8">
                        <p className="text-sm text-center text-[var(--color-text-secondary)] mb-3">{t('login.demoAccounts')}</p>
                        <div className="grid grid-cols-2 gap-2">
                            {demoAccounts.map((account) => (
                                <button key={account.role} onClick={() => fillDemo(account)} className="px-3 py-2 text-sm font-medium rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                                    <span className="font-semibold">{account.role}</span>
                                    <span className="block text-xs text-[var(--color-text-secondary)]">{account.email}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
