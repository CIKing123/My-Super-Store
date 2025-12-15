import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OrderConfirmation() {
    return (
        <div className="section flex items-center justify-center min-h-[60vh]">
            <div className="card-black max-w-2xl w-full text-center p-16">
                <div className="flex justify-center mb-8">
                    <CheckCircle size={80} className="text-[var(--gold-primary)]" strokeWidth={1} />
                </div>

                <h1 className="font-serif text-4xl mb-4 bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold-primary)] to-[var(--gold-dark)] bg-clip-text text-transparent">
                    Order Confirmed
                </h1>
                <p className="text-gray-400 mb-8 text-lg">
                    Thank you for your purchase. Your order #MSS-8829 has been processed.
                </p>

                <div className="bg-white/5 rounded p-8 mb-8 text-left max-w-md mx-auto">
                    <h4 className="text-white font-bold mb-4">Order Details</h4>
                    <div className="space-y-2 text-gray-400">
                        <div className="flex justify-between"><span>Estimated Delivery</span><span className="text-white">Dec 18, 2025</span></div>
                        <div className="flex justify-between"><span>Payment Method</span><span className="text-white">Visa ending 4242</span></div>
                        <div className="flex justify-between pt-4 border-t border-white/10 mt-4">
                            <span>Total Amount</span>
                            <span className="text-[var(--gold-primary)] font-bold">$13,500</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <Link to="/account" className="btn-outline-gold no-underline">
                        Track Order
                    </Link>
                    <Link to="/shop" className="btn-primary no-underline">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
