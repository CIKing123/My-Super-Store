import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';

export function Login() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (activeTab === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/account');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;
                // Typically check for email confirmation logic here
                alert('Registration successful! Please check your email to confirm your account.');
                setActiveTab('login');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section flex items-center justify-center min-h-[80vh] py-12">
            <div className="card-black max-w-md w-full p-8 relative overflow-hidden backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl">

                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--gold-primary)]/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <h2 className="text-3xl font-display text-center mb-8 text-white">
                        {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>

                    {/* Tabs */}
                    <div className="flex mb-8 border-b border-white/10">
                        <button
                            className={`flex-1 pb-4 font-bold transition-all text-sm uppercase tracking-wider ${activeTab === 'login' ? 'text-[var(--gold-primary)] border-b-2 border-[var(--gold-primary)]' : 'text-gray-500 hover:text-gray-300'}`}
                            onClick={() => { setActiveTab('login'); setError(null); }}
                        >
                            Login
                        </button>
                        <button
                            className={`flex-1 pb-4 font-bold transition-all text-sm uppercase tracking-wider ${activeTab === 'register' ? 'text-[var(--gold-primary)] border-b-2 border-[var(--gold-primary)]' : 'text-gray-500 hover:text-gray-300'}`}
                            onClick={() => { setActiveTab('register'); setError(null); }}
                        >
                            Register
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-200 text-sm animate-fade-in">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleEmailAuth}>
                        {activeTab === 'register' && (
                            <div className="group">
                                <label className="block text-gray-400 mb-2 text-xs uppercase tracking-wider font-semibold">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--gold-primary)] transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-[var(--gold-primary)] focus:bg-white/10 outline-none transition-all placeholder:text-gray-600"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="group">
                            <label className="block text-gray-400 mb-2 text-xs uppercase tracking-wider font-semibold">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--gold-primary)] transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-[var(--gold-primary)] focus:bg-white/10 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-gray-400 mb-2 text-xs uppercase tracking-wider font-semibold">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--gold-primary)] transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-[var(--gold-primary)] focus:bg-white/10 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {activeTab === 'login' && (
                            <div className="flex justify-between items-center text-sm">
                                <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                                    <input type="checkbox" className="accent-[var(--gold-primary)] w-4 h-4 rounded border-white/20 bg-white/5" />
                                    Remember me
                                </label>
                                <a href="#" className="text-[var(--gold-primary)] hover:text-white transition-colors">Forgot Password?</a>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 font-bold tracking-wide shadow-lg shadow-[var(--gold-primary)]/20 hover:shadow-[var(--gold-primary)]/40 transition-all"
                        >
                            {loading && <Loader2 className="animate-spin" size={20} />}
                            {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-4 text-gray-500">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-xs uppercase tracking-widest">Or continue with</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-lg"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
