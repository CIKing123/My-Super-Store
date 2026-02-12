import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { AdminUser, AdminRole, AdminPermission } from '../types/admin';

interface AdminContextType {
    isAdmin: boolean;
    adminUser: AdminUser | null;
    adminRole: AdminRole | null;
    permissions: AdminPermission[];
    loading: boolean;
    hasPermission: (permission: AdminPermission) => boolean;
    checkAdminAccess: () => boolean;
}

const AdminContext = createContext<AdminContextType>({
    isAdmin: false,
    adminUser: null,
    adminRole: null,
    permissions: [],
    loading: true,
    hasPermission: () => false,
    checkAdminAccess: () => false,
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
    const [permissions, setPermissions] = useState<AdminPermission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user) {
                setIsAdmin(false);
                setAdminUser(null);
                setAdminRole(null);
                setPermissions([]);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('admin_users')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    throw error;
                }

                if (data) {
                    setAdminUser(data);
                    setIsAdmin(true);
                    setAdminRole(data.role);
                    setPermissions(data.permissions || []);
                } else {
                    setIsAdmin(false);
                    setAdminUser(null);
                    setAdminRole(null);
                    setPermissions([]);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
                setAdminUser(null);
                setPermissions([]);
            } finally {
                setLoading(false);
            }
        };

        checkAdminStatus();
    }, [user]);

    const hasPermission = (permission: AdminPermission): boolean => {
        if (!isAdmin) return false;
        
        // Super admins have all permissions
        if (adminRole === AdminRole.SUPER_ADMIN) return true;
        
        return permissions.includes(permission);
    };

    const checkAdminAccess = (): boolean => {
        return isAdmin;
    };

    return (
        <AdminContext.Provider value={{
            isAdmin,
            adminUser,
            adminRole,
            permissions,
            loading,
            hasPermission,
            checkAdminAccess,
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export const useAdmin = () => useContext(AdminContext);
