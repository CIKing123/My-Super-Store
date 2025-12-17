import { useEffect, useState } from 'react';
import { CreditCard, LogOut, ChevronRight, ShoppingBag, Loader2, Sparkles, Crown, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { getAvatarUrl } from '../lib/avatarUtils';
import { useNavigate } from 'react-router-dom';

export function Account() {
    const { user, signOut, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('orders');
    const [orders, setOrders] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) navigate('/login');
        if (user) fetchData();
    }, [user, authLoading, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: profileData } = await supabase.from('user_profiles').select('*').eq('user_id', user!.id).single();
            setProfile(profileData);

            // Load avatar URL
            if (profileData?.avatar_url || user?.user_metadata?.avatar_url) {
                const url = await getAvatarUrl(profileData?.avatar_url || user?.user_metadata?.avatar_url);
                setAvatarUrl(url);
            }

            const { data: ordersData } = await supabase.from('orders').select(`*, order_items ( *, products ( name, product_images ( url ) ) )`).eq('user_id', user!.id).order('placed_at', { ascending: false });
            setOrders(ordersData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const menuItems = [
        { id: 'orders', label: 'Orders', icon: Crown, description: 'Track your purchases' },
        { id: 'addresses', label: 'Addresses', icon: Sparkles, description: 'Delivery locations' },
        { id: 'payment', label: 'Payment', icon: CreditCard, description: 'Cards & billing' },
        { id: 'profile', label: 'Profile', icon: Star, description: 'Personal info' },
    ];

    if (authLoading || (loading && !profile && !orders.length)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <Loader2 className="animate-spin text-[#FFC92E] mx-auto mb-4" size={48} />
                    <p className="text-gray-500">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="section py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Header */}
                    <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B0B0B] via-[#111] to-[#0B0B0B] p-8 border border-[#FFC92E]/30 shadow-[0_0_30px_rgba(255,201,46,0.1)]">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FEFDFE] via-[#FFC92E] to-[#DE9D0D] opacity-5"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC92E] rounded-full blur-[80px] opacity-10"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-[#FFC92E]/10 rounded-full border border-[#FFC92E]/20">
                                        <Crown className="text-[#FFC92E]" size={28} strokeWidth={1.5} />
                                    </div>
                                    <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-[#FEFDFE] via-[#FFC92E] to-[#DE9D0D] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                        Welcome Back
                                    </h1>
                                </div>
                                <p className="text-gray-400 text-lg">{profile?.display_name || user?.user_metadata?.full_name || 'Valued Customer'}</p>
                            </div>
                            <div className="flex items-center gap-8 bg-white/5 px-6 py-3 rounded-xl border border-white/5">
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Total Orders</p>
                                    <p className="text-2xl font-bold bg-gradient-to-b from-[#FFC92E] to-[#DE9D0D] bg-clip-text text-transparent">{orders.length}</p>
                                </div>
                                <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Member Tier</p>
                                    <p className="text-lg font-semibold text-white flex items-center gap-1 justify-end">
                                        <Star size={14} className="fill-[#FFC92E] text-[#FFC92E]" />
                                        Gold
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* User Card */}
                            <div className="relative overflow-hidden rounded-2xl bg-[#0F0F0F] p-6 border border-[#FFC92E]/20 shadow-xl group">
                                <div className="absolute inset-0 bg-gradient-to-b from-[#FFC92E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#FEFDFE] via-[#FFC92E] to-[#DE9D0D] rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                                        <div className="relative w-24 h-24 rounded-full p-[2px] bg-gradient-to-r from-[#FEFDFE] via-[#FFC92E] to-[#DE9D0D]">
                                            <div className="w-full h-full rounded-full bg-[#0B0B0B] flex items-center justify-center overflow-hidden">
                                                {avatarUrl ? (
                                                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-3xl font-bold bg-gradient-to-r from-[#FFC92E] to-[#DE9D0D] bg-clip-text text-transparent">
                                                        {(profile?.display_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 right-0 bg-[#0B0B0B] rounded-full p-1 border border-[#FFC92E]">
                                            <div className="w-3 h-3 bg-[#00FF00] rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">
                                        {profile?.display_name || user?.user_metadata?.full_name || 'Valued Customer'}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-6 font-mono">{user?.email}</p>

                                    <button className="w-full py-2 rounded-lg bg-[#FFC92E]/10 border border-[#FFC92E]/30 text-[#FFC92E] text-xs font-bold uppercase tracking-widest hover:bg-[#FFC92E] hover:text-black transition-all duration-300">
                                        Edit Profile
                                    </button>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#0F0F0F] shadow-lg">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center gap-4 p-5 transition-all duration-300 text-left border-b border-white/5 last:border-b-0 group relative overflow-hidden
                                            ${activeSection === item.id
                                                ? 'bg-white/5'
                                                : 'hover:bg-white/5'
                                            }`}
                                    >
                                        {activeSection === item.id && (
                                            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#FFC92E] to-[#DE9D0D]"></div>
                                        )}
                                        <div className={`relative z-10 p-2 rounded-lg transition-all duration-300 ${activeSection === item.id
                                            ? 'bg-gradient-to-br from-[#FFC92E] to-[#DE9D0D] text-black shadow-[0_0_15px_rgba(255,201,46,0.3)]'
                                            : 'bg-white/5 text-gray-400 group-hover:text-[#FFC92E] group-hover:bg-[#FFC92E]/10'
                                            }`}>
                                            <item.icon size={18} strokeWidth={activeSection === item.id ? 2.5 : 2} />
                                        </div>
                                        <div className="flex-1 relative z-10">
                                            <div className={`text-sm font-bold tracking-wide transition-colors ${activeSection === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                                {item.label}
                                            </div>
                                            <div className={`text-[10px] uppercase tracking-wider ${activeSection === item.id ? 'text-[#FFC92E]' : 'text-gray-600'}`}>
                                                {item.description}
                                            </div>
                                        </div>
                                        <ChevronRight
                                            size={16}
                                            className={`relative z-10 transition-all duration-300 ${activeSection === item.id
                                                ? 'text-[#FFC92E] translate-x-0'
                                                : 'text-gray-600 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                                                }`}
                                        />
                                    </button>
                                ))}

                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-4 p-5 text-gray-500 hover:text-red-400 transition-all text-left group relative overflow-hidden hover:bg-red-500/5"
                                >
                                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-red-500/10 transition-all">
                                        <LogOut size={18} strokeWidth={2} />
                                    </div>
                                    <span className="font-medium text-sm tracking-wide">Sign Out</span>
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-3">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-serif font-bold text-white">
                                        {menuItems.find(i => i.id === activeSection)?.label}
                                    </h2>
                                    <div className="h-px w-12 bg-[#FFC92E]/30"></div>
                                </div>
                            </div>

                            {activeSection === 'orders' && (
                                <div className="space-y-6">
                                    {orders.length === 0 ? (
                                        <div className="relative overflow-hidden rounded-2xl bg-[#0F0F0F] p-16 text-center border border-dashed border-[#FFC92E]/20">
                                            <div className="relative z-10">
                                                <div className="w-20 h-20 bg-[#FFC92E]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#FFC92E]/20">
                                                    <ShoppingBag size={32} className="text-[#FFC92E]" strokeWidth={1.5} />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-3">No orders placed yet</h3>
                                                <p className="text-gray-500 mb-8 max-w-md mx-auto">Start your collection of premium products today.</p>
                                                <button
                                                    onClick={() => navigate('/shop')}
                                                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#FFC92E] to-[#DE9D0D] text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(255,201,46,0.3)] transition-all transform hover:-translate-y-0.5"
                                                >
                                                    <Sparkles size={18} />
                                                    Explore Shop
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        orders.map((order) => (
                                            <div key={order.id} className="relative overflow-hidden rounded-2xl bg-[#0F0F0F] border border-white/5 shadow-lg hover:border-[#FFC92E]/30 transition-all duration-300 group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-[#FFC92E]/0 via-[#FFC92E]/5 to-[#FFC92E]/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                <div className="relative z-10 p-6 border-b border-white/5 bg-white/[0.02]">
                                                    <div className="flex flex-wrap gap-6 justify-between items-center">
                                                        <div className="flex gap-8">
                                                            <div>
                                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Order ID</p>
                                                                <p className="font-mono text-white text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Date</p>
                                                                <p className="text-gray-300 text-sm">{new Date(order.placed_at).toLocaleDateString()}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Total</p>
                                                                <p className="text-lg font-bold text-[#FFC92E]">
                                                                    ${order.total_amount.toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="px-3 py-1 rounded border border-[#FFC92E]/30 text-[10px] font-bold uppercase tracking-widest text-[#FFC92E] bg-[#FFC92E]/10">
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="relative z-10 p-6 space-y-4">
                                                    {order.order_items?.map((item: any) => (
                                                        <div key={item.id} className="flex gap-4 items-center p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                                            <div className="w-16 h-16 bg-white/5 rounded overflow-hidden flex-shrink-0 border border-white/10">
                                                                {item.products?.product_images?.[0]?.url && (
                                                                    <img src={item.products.product_images[0].url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-white font-medium mb-1">{item.products?.name}</h4>
                                                                <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.unit_price}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-white">${(item.quantity * item.unit_price).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Placeholders for other sections to handle layout */}
                            {activeSection !== 'orders' && activeSection !== 'profile' && (
                                <div className="relative overflow-hidden rounded-2xl bg-[#0F0F0F] p-16 text-center border border-dashed border-[#FFC92E]/20">
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-[#FFC92E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Loader2 size={24} className="text-[#FFC92E] animate-spin-slow" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">Coming Soon</h3>
                                        <p className="text-gray-500">This feature is currently under development.</p>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'profile' && (
                                <div className="relative overflow-hidden rounded-2xl bg-[#0F0F0F] p-8 border border-[#FFC92E]/20 shadow-lg">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC92E] rounded-full blur-[100px] opacity-5"></div>
                                    <form className="relative z-10 space-y-6 max-w-2xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-500 mb-2 text-[10px] uppercase tracking-widest font-bold">Full Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue={profile?.display_name || user?.user_metadata?.full_name}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#FFC92E]/50 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-500 mb-2 text-[10px] uppercase tracking-widest font-bold">Phone</label>
                                                <input
                                                    type="tel"
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#FFC92E]/50 transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-500 mb-2 text-[10px] uppercase tracking-widest font-bold">Email</label>
                                            <input
                                                disabled
                                                value={user?.email}
                                                className="w-full bg-black/20 border border-white/5 rounded-lg p-3 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="px-8 py-3 bg-gradient-to-r from-[#FFC92E] to-[#DE9D0D] text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(255,201,46,0.2)] transition-all flex items-center gap-2"
                                        >
                                            <Sparkles size={18} />
                                            Save Changes
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
