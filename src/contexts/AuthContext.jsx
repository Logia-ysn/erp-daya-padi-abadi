import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '@/lib/utils';

const AuthContext = createContext(null);

// Mock users for demo
const MOCK_USERS = [
    { id: 1, email: 'admin@dayapadi.com', password: 'admin123', name: 'Administrator', role: 'admin', avatar: null },
    { id: 2, email: 'operator@dayapadi.com', password: 'operator123', name: 'Operator Produksi', role: 'operator', avatar: null },
    { id: 3, email: 'finance@dayapadi.com', password: 'finance123', name: 'Staff Finance', role: 'finance', avatar: null },
    { id: 4, email: 'manager@dayapadi.com', password: 'manager123', name: 'Manager Operasional', role: 'manager', avatar: null },
];

// Role permissions
const ROLE_PERMISSIONS = {
    admin: ['all'],
    manager: ['dashboard', 'procurement', 'production', 'inventory', 'maintenance', 'sales', 'finance', 'reports'],
    operator: ['dashboard', 'production', 'inventory', 'maintenance'],
    finance: ['dashboard', 'procurement', 'sales', 'finance', 'reports'],
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const savedUser = storage.get('auth_user');
        if (savedUser) {
            setUser(savedUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const foundUser = MOCK_USERS.find(
            u => u.email === email && u.password === password
        );

        if (!foundUser) {
            throw new Error('Invalid credentials');
        }

        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        storage.set('auth_user', userWithoutPassword);
        return userWithoutPassword;
    };

    const logout = () => {
        setUser(null);
        storage.remove('auth_user');
    };

    const hasPermission = (permission) => {
        if (!user) return false;
        const userPermissions = ROLE_PERMISSIONS[user.role] || [];
        return userPermissions.includes('all') || userPermissions.includes(permission);
    };

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export default AuthContext;
