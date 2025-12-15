import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Login() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    return (
        <div className="section flex items-center justify-center min-h-[70vh]">
            <div className="card-black max-w-md w-full p-8">

                {/* Tabs */}
                <div className="flex mb-8 border-b border-white/10">
                    <button
                        className={`flex-1 pb-4 font-bold transition-all ${activeTab === 'login' ? 'text-[var(--gold-primary)] border-b-2 border-[var(--gold-primary)]' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`flex-1 pb-4 font-bold transition-all ${activeTab === 'register' ? 'text-[var(--gold-primary)] border-b-2 border-[var(--gold-primary)]' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('register')}
                    >
                        Register
                    </button>
                </div>

                {activeTab === 'login' ? (
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Email Address</label>
                            <input type="email" className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-[var(--gold-primary)] outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Password</label>
                            <input type="password" className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-[var(--gold-primary)] outline-none transition-colors" />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                                <input type="checkbox" className="accent-[var(--gold-primary)]" />
                                Remember me
                            </label>
                            <a href="#" className="text-[var(--gold-primary)] hover:underline">Forgot Password?</a>
                        </div>
                        <Link to="/account" className="btn-primary w-full text-center block no-underline">
                            Sign In
                        </Link>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Full Name</label>
                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-[var(--gold-primary)] outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Email Address</label>
                            <input type="email" className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-[var(--gold-primary)] outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Password</label>
                            <input type="password" className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-[var(--gold-primary)] outline-none transition-colors" />
                        </div>
                        <button className="btn-primary w-full">Create Account</button>
                    </form>
                )}
            </div>
        </div>
    );
}
