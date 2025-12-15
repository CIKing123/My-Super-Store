import { useEffect, useState } from 'react';
import { Package, MapPin, CreditCard, User, LogOut, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Account() {
    const { user, signOut, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('orders');
    const [orders, setOrders] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        } else if (user) {
            fetchData();
        }
    }, [user, authLoading, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Profile
            const { data: profileData } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', user!.id)
                .single();

            setProfile(profileData || { email: user!.email });

            // Fetch Orders
            const { data: ordersData } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        id,
                        quantity,
                        unit_price,
                        products ( name )
                    )
                `)
                .eq('user_id', user!.id)
                .order('placed_at', { ascending: false });

            setOrders(ordersData || []);

        } catch (error) {
            console.error('Error fetching account data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const menuItems = [
        { id: 'orders', label: 'Orders', icon: Package },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'payment', label: 'Payment Methods', icon: CreditCard },
        { id: 'profile', label: 'Profile Details', icon: User },
    ];

    if (authLoading || (loading && !profile)) {
        return (
            <div className="section min-h-[80vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--gold-primary)]" size={48} />
            </div>
        );
    }

    return (
        <div className="section min-h-[80vh]">
            <h1 className="page-title mb-12">My Account</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar */}
                <div className="card-black h-fit p-6 space-y-2">
                    <div className="p-4 mb-4 border-b border-white/10">
                        <p className="text-sm text-gray-400">Welcome,</p>
                        <p className="font-bold text-white text-lg truncate">
                            {profile?.display_name || user?.email}
                        </p>
                    </div>

                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 p-4 rounded transition-all text-left ${activeSection === item.id ? 'bg-[var(--gold-gradient)] text-black font-bold shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 p-4 rounded text-red-400 hover:bg-white/5 mt-8 text-left"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {activeSection === 'orders' && (
                        <div className="card-black p-8">
                            <h2 className="text-2xl font-serif mb-8 text-[var(--gold-primary)]">Order History</h2>

                            {orders.length === 0 ? (
                                <p className="text-gray-400">No orders found.</p>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border border-white/10 rounded p-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 gap-4">
                                            <div>
                                                <div className="flex gap-4 mb-2 items-center">
                                                    <span className="font-bold text-white">#{order.id.slice(0, 8)}</span>
                                                    <span className="text-gray-400 text-sm">
                                                        {new Date(order.placed_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    {order.order_items?.length || 0} items
                                                    {order.order_items?.length > 0 && ` • ${order.order_items[0].products?.name || 'Item'} ...`}
                                                </p>
                                            </div>
                                            <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                                                <div className="text-[var(--gold-primary)] font-bold mb-0 md:mb-2">
                                                    ${order.total_amount.toLocaleString()}
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                                    ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                                                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                                                            'bg-white/10 text-gray-400 border border-white/20'}
                                                `}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === 'profile' && (
                        <div className="card-black p-8">
                            <h2 className="text-2xl font-serif mb-8 text-[var(--gold-primary)]">Profile Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 mb-1 text-sm">Email</label>
                                    <input disabled value={user?.email} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white opacity-50 cursor-not-allowed" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1 text-sm">Full Name</label>
                                    <div className="p-3 bg-white/5 border border-white/10 rounded text-white min-h-[48px]">
                                        {profile?.display_name || 'Not set'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholders for other sections */}
                    {(activeSection === 'addresses' || activeSection === 'payment') && (
                        <div className="card-black p-8 flex items-center justify-center min-h-[400px]">
                            <p className="text-gray-400">Section coming soon...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
