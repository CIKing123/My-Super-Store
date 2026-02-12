import { useEffect, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { supabase } from '../../lib/supabase';
import { AdminStats, DashboardMetric } from '../../types/admin';
import { Users, ShoppingBag, Store, TrendingUp } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

export function AdminDashboard() {
    const { isAdmin } = useAdmin();
    const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        totalVendors: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingVendorApprovals: 0,
        pendingProductApprovals: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch total users
            const { count: usersCount } = await supabase
                .from('auth.users')
                .select('id', { count: 'exact', head: true });

            // Fetch total vendors
            const { count: vendorsCount } = await supabase
                .from('vendors')
                .select('id', { count: 'exact', head: true });

            // Fetch total products
            const { count: productsCount } = await supabase
                .from('products')
                .select('id', { count: 'exact', head: true });

            // Fetch total orders
            const { count: ordersCount } = await supabase
                .from('orders')
                .select('id', { count: 'exact', head: true });

            // Fetch pending approvals
            const { count: pendingVendors } = await supabase
                .from('vendors')
                .select('id', { count: 'exact', head: true })
                .eq('is_verified', false);

            // Calculate total revenue
            const { data: ordersData } = await supabase
                .from('orders')
                .select('total_amount')
                .eq('status', 'completed');

            const totalRevenue = ordersData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

            setStats({
                totalUsers: usersCount || 0,
                totalVendors: vendorsCount || 0,
                totalProducts: productsCount || 0,
                totalOrders: ordersCount || 0,
                totalRevenue: totalRevenue,
                pendingVendorApprovals: pendingVendors || 0,
                pendingProductApprovals: 0,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return (
            <AdminLayout>
                <div className="text-center py-12">
                    <p className="text-red-600 text-lg">Access Denied</p>
                    <p className="text-gray-600">You do not have admin privileges.</p>
                </div>
            </AdminLayout>
        );
    }

    const metrics: DashboardMetric[] = [
        {
            label: 'Total Users',
            value: stats.totalUsers,
            icon: 'users',
        },
        {
            label: 'Active Vendors',
            value: stats.totalVendors,
            icon: 'store',
        },
        {
            label: 'Total Products',
            value: stats.totalProducts,
            icon: 'shopping-bag',
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders,
            icon: 'trending-up',
        },
        {
            label: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: 'trending-up',
        },
        {
            label: 'Pending Approvals',
            value: stats.pendingVendorApprovals,
            icon: 'alert',
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome to your admin panel</p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading stats...</p>
                    </div>
                ) : (
                    <>
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Total Users */}
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Total Users</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                                    </div>
                                    <Users className="text-blue-500" size={32} />
                                </div>
                            </div>

                            {/* Active Vendors */}
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Active Vendors</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.totalVendors}</p>
                                    </div>
                                    <Store className="text-green-500" size={32} />
                                </div>
                            </div>

                            {/* Total Products */}
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Total Products</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                                    </div>
                                    <ShoppingBag className="text-purple-500" size={32} />
                                </div>
                            </div>

                            {/* Total Orders */}
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Total Orders</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                                    </div>
                                    <TrendingUp className="text-orange-500" size={32} />
                                </div>
                            </div>

                            {/* Total Revenue */}
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Total Revenue</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            ${stats.totalRevenue.toLocaleString()}
                                        </p>
                                    </div>
                                    <TrendingUp className="text-yellow-500" size={32} />
                                </div>
                            </div>

                            {/* Pending Approvals */}
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Pending Approvals</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {stats.pendingVendorApprovals}
                                        </p>
                                    </div>
                                    <TrendingUp className="text-red-500" size={32} />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <a
                                    href="/admin/users"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center transition-colors"
                                >
                                    Manage Users
                                </a>
                                <a
                                    href="/admin/vendors"
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center transition-colors"
                                >
                                    Manage Vendors
                                </a>
                                <a
                                    href="/admin/products"
                                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-center transition-colors"
                                >
                                    Manage Products
                                </a>
                                <a
                                    href="/admin/orders"
                                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-center transition-colors"
                                >
                                    View Orders
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
