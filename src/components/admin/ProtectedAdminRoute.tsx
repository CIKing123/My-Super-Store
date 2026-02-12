import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { AdminPermission } from '../types/admin';

interface ProtectedAdminRouteProps {
    children: React.ReactNode;
    requiredPermission?: AdminPermission;
}

/**
 * ProtectedAdminRoute - Wrapper component to protect admin routes
 * Redirects to home if user is not an admin or lacks required permission
 */
export function ProtectedAdminRoute({
    children,
    requiredPermission,
}: ProtectedAdminRouteProps) {
    const { isAdmin, loading, hasPermission } = useAdmin();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600">Loading admin panel...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-red-600 text-lg">Access Denied</p>
                    <p className="text-gray-600">You do not have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
