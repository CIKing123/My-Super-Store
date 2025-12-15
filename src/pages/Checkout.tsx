import { useState } from 'react';
import { Check, CreditCard, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Checkout() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const steps = [
        { id: 1, title: 'Shipping', icon: Truck },
        { id: 2, title: 'Payment', icon: CreditCard },
        { id: 3, title: 'Confirmation', icon: Check }
    ];

    return (
        <div className="section">
            <div className="max-w-6xl mx-auto">
                <h1 className="page-title mb-12">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Steps Indicator */}
                        <div className="flex justify-between mb-8">
                            {steps.map((s) => (
                                <div key={s.id} className={`flex items-center gap-3 ${step >= s.id ? 'opacity-100' : 'opacity-40'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= s.id ? 'border-[var(--gold-primary)] text-[var(--gold-primary)]' : 'border-gray-400 text-gray-400'}`}>
                                        <s.icon size={20} />
                                    </div>
                                    <span className="font-semibold">{s.title}</span>
                                </div>
                            ))}
                        </div>

                        {/* Shipping Form */}
                        <div className={`card-black ${step !== 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                            <h3 className="text-2xl font-serif mb-6 text-[var(--gold-primary)]">Shipping Address</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <input type="text" placeholder="First Name" className="bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-500" />
                                <input type="text" placeholder="Last Name" className="bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-500" />
                                <input type="email" placeholder="Email" className="col-span-2 bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-500" />
                                <input type="text" placeholder="Address" className="col-span-2 bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-500" />
                                <input type="text" placeholder="City" className="bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-500" />
                                <input type="text" placeholder="Postal Code" className="bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-500" />
                            </div>
                            {step === 1 && (
                                <button
                                    onClick={() => setStep(2)}
                                    className="btn-primary mt-8 w-full"
                                >
                                    Continue to Payment
                                </button>
                            )}
                        </div>

                        {/* Payment Form */}
                        <div className={`card-black ${step !== 2 ? 'opacity-50 pointer-events-none' : ''}`}>
                            <h3 className="text-2xl font-serif mb-6 text-[var(--gold-primary)]">Payment Method</h3>
                            <div className="space-y-4">
                                <div className="p-4 border border-[var(--gold-primary)] rounded flex items-center gap-4 bg-[var(--gold-glow)]">
                                    <CreditCard className="text-[var(--gold-primary)]" />
                                    <span>Credit Card</span>
                                </div>
                                <div className="grid grid-cols-2 gap-6 mt-4">
                                    <input type="text" placeholder="Card Number" className="col-span-2 bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-500" />
                                    <input type="text" placeholder="MM/YY" className="bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-500" />
                                    <input type="text" placeholder="CVC" className="bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-500" />
                                </div>
                            </div>
                            {step === 2 && (
                                <button
                                    onClick={() => navigate('/order-confirmation')}
                                    className="btn-primary mt-8 w-full"
                                >
                                    Place Order
                                </button>
                            )}
                        </div>

                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="card-black sticky top-24">
                            <h3 className="font-serif text-xl mb-6">Order Summary</h3>
                            <div className="space-y-4 text-gray-400">
                                <div className="flex justify-between"><span>Subtotal</span><span>$12,500</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
                                <div className="flex justify-between"><span>Tax</span><span>$1,000</span></div>
                                <div className="border-t border-white/10 pt-4 flex justify-between text-white font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-[var(--gold-primary)]">$13,500</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
