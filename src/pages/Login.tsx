import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Login() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    return (
        <div className="section flex items-center justify-center min-h-[70vh]">
            <div className="card-black max-w-md w-full p-8">



                {activeTab === 'login' ? (
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Email Address</label>
                            <input type="email" className="input-field" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Password</label>
                            <input type="password" className="input-field" />
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
                        <div>
                            <p className="text-center text-gray-400 text-sm">Don't have an account? <p
                                className="link-text underline cursor-pointer"
                                onClick={() => setActiveTab('register')}
                            >
                                Register
                            </p>
                            </p>
                        </div>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div style={{ textAlign: 'center', margin: '0 auto' }}>
                            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Full Name</label>
                            <input type="text" className="input-field" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Email Address</label>
                            <input type="email" className="input-field" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Password</label>
                            <input type="password" className="input-field" />
                        </div>
                        <button className="btn-primary w-full">Create Account</button>
                        <p className="text-center text-gray-400 text-sm">Already have an account? <p
                            className="login-link-text underline cursor-pointer"
                            onClick={() => setActiveTab('login')}
                        >
                            Login
                        </p>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
