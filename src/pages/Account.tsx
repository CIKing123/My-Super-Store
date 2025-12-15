import { useState } from 'react';
import { Package, MapPin, CreditCard, User, LogOut } from 'lucide-react';

export function Account() {
    const [activeSection, setActiveSection] = useState('orders');

    const menuItems = [
        { id: 'orders', label: 'Orders', icon: Package },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'payment', label: 'Payment Methods', icon: CreditCard },
        { id: 'profile', label: 'Profile Details', icon: User },
    ];

    return (
        <div className="section min-h-[80vh]">
            <h1 className="page-title mb-12">My Account</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar */}
                <div className="card-black h-fit p-6 space-y-2">
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
                    <button className="w-full flex items-center gap-3 p-4 rounded text-red-400 hover:bg-white/5 mt-8 text-left">
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {activeSection === 'orders' && (
                        <div className="card-black p-8">
                            <h2 className="text-2xl font-serif mb-8 text-[var(--gold-primary)]">Order History</h2>
                            <div className="space-y-6">
                                {[1, 2].map((order) => (
                                    <div key={order} className="border border-white/10 rounded p-6 flex justify-between items-center bg-white/5">
                                        <div>
                                            <div className="flex gap-4 mb-2">
                                                <span className="font-bold text-white">#MSS-882{order}</span>
                                                <span className="text-gray-400">Dec {10 + order}, 2025</span>
                                            </div>
                                            <p className="text-gray-400">Chronograph Elite + 2 items</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[var(--gold-primary)] font-bold mb-2">$14,250</div>
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--gold-glow)] text-[var(--gold-primary)] border border-[var(--gold-primary)]">
                                                Delivered
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Placeholders for other sections */}
                    {activeSection !== 'orders' && (
                        <div className="card-black p-8 flex items-center justify-center min-h-[400px]">
                            <p className="text-gray-400">Section content goes here...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
