import { useState, useEffect } from 'react';
import { Check, CreditCard, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

declare global {
    interface Window {
        setStepProgress?: (index: number) => void;
    }
}

export function Checkout() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const steps = [
        { id: 1, title: 'Shipping', icon: Truck },
        { id: 2, title: 'Payment', icon: CreditCard },
        { id: 3, title: 'Confirmation', icon: Check }
    ];

    // Update progress bar when step changes
    useEffect(() => {
        window.setStepProgress?.(step - 1);
    }, [step]);

    return (
        <div className="section relative">
            <div className="max-w-6xl mx-auto">
                <h1 className="page-title mb-12">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Steps Indicator */}
                        <div id="steps" className="relative flex justify-between items-center w-full px-6 mb-12">
                            {/* Full track (background) */}
                            <div id="progress-bg" className="absolute top-5 h-1 rounded-full bg-gray-600 pointer-events-none z-0"></div>
                            {/* Filled track (progress) */}
                            <div id="progress-fill" className="absolute top-5 h-1 rounded-full bg-[var(--gold-primary)] pointer-events-none z-10 transition-all duration-500"></div>

                            {steps.map((s) => (
                                <div key={s.id} className={`step flex flex-col items-center gap-2 relative z-20 ${step >= s.id ? 'opacity-100' : 'opacity-40'}`}>
                                    <div className={`icon w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-black ${step >= s.id ? 'border-[var(--gold-primary)] text-[var(--gold-primary)]' : 'border-gray-400 text-gray-400'}`}>
                                        <s.icon size={20} />
                                    </div>
                                    <span className="font-semibold text-sm whitespace-nowrap">{s.title}</span>
                                </div>
                            ))}
                        </div>

                        <script dangerouslySetInnerHTML={{__html: `
                            (function () {
                                const container = document.getElementById('steps');
                                const progressBg = document.getElementById('progress-bg');
                                const progressFill = document.getElementById('progress-fill');

                                let completedIndex = 0;

                                function updateProgress() {
                                    const stepIcons = Array.from(container.querySelectorAll('.step .icon'));
                                    if (stepIcons.length < 2) return;

                                    const containerRect = container.getBoundingClientRect();

                                    const centers = stepIcons.map(icon => {
                                        const r = icon.getBoundingClientRect();
                                        return (r.left + r.right) / 2 - containerRect.left;
                                    });

                                    const left = centers[0];
                                    const right = centers[centers.length - 1];

                                    const trackLeftPx = left;
                                    const trackWidthPx = Math.max(0, right - left);

                                    progressBg.style.left = trackLeftPx + 'px';
                                    progressBg.style.width = trackWidthPx + 'px';

                                    const fillRight = centers[Math.min(completedIndex, centers.length - 1)];
                                    const fillWidthPx = Math.max(0, fillRight - left);

                                    progressFill.style.left = trackLeftPx + 'px';
                                    progressFill.style.width = fillWidthPx + 'px';
                                }

                                window.setStepProgress = function (index) {
                                    completedIndex = index;
                                    updateProgress();
                                };

                                let resizeTimer;
                                window.addEventListener('resize', () => {
                                    clearTimeout(resizeTimer);
                                    resizeTimer = setTimeout(updateProgress, 80);
                                });

                                requestAnimationFrame(() => requestAnimationFrame(updateProgress));
                            })();
                        `}}></script>

                        {/* Shipping Form */}
                        <div className={`card-black ${step !== 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                            <h3 className="text-2xl font-serif mb-6 text-[var(--gold-primary)]">Shipping Address</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <input type="text" placeholder="First Name" className="bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-200" />
                                <input type="text" placeholder="Last Name" className="bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-200" />
                                <input type="email" placeholder="Email" className="col-span-2 bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-200" />
                                <input type="text" placeholder="Address" className="col-span-2 bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-200" />
                                <input type="text" placeholder="City" className="bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-200" />
                                <input type="text" placeholder="Postal Code" className="bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-200" />
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
                                    <input type="text" placeholder="Card Number" className="col-span-2 bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-300" />
                                    <input type="text" placeholder="MM/YY" className="bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-300" />
                                    <input type="text" placeholder="CVC" className="bg-white/10 border border-white/20 p-3 rounded text-white placeholder:text-gray-3s00" />
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
