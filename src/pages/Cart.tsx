import { Minus, Plus, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onNavigate: (page: string) => void;
}

export function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onNavigate }: CartProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="section">
      <h1 className="page-title mb-12">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="card-black p-24 text-center">
          <h3 className="text-white mb-6">Your cart is empty</h3>
          <p className="text-muted mb-12">Discover our exceptional collection</p>
          <button
            onClick={() => onNavigate('shop')}
            className="btn-primary"
            style={{ padding: '1rem 3rem' }}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-grid">
          {/* Cart Items */}
          <div className="col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="card-black p-6 flex gap-6">
                {/* Image */}
                <div className="cart-thumb">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="product-image"
                  />
                </div>

                {/* Details */}
                <div className="cart-details">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-muted mb-2">{item.category}</p>
                      <h4 className="text-white mb-2">{item.name}</h4>
                      <div className="text-white font-bold">
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
                    >
                      <X size={24} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="qty-btn"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="text-white w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                    <div className="bg-gradient-to-r from-[#FFE55C] via-[#D4AF37] to-[#B8941F] bg-clip-text text-transparent font-bold">
                      ${(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="card-black p-8 sticky top-24">
              <h3 className="text-white mb-8 font-serif">Order Summary</h3>

              <div className="space-y-4 mb-8">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="summary-total">
                  <span>Total</span>
                  <div className="total-price">
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', marginBottom: '1rem', padding: '1rem' }}
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => onNavigate('shop')}
                className="btn-outline-gold"
                style={{ width: '100%', padding: '1rem' }}
              >
                Continue Shopping
              </button>

              {/* Free Shipping Message */}
              {subtotal < 500 && (
                <div className="mt-6 p-4 border border-[rgba(222,157,13,0.3)] text-center">
                  <p className="text-muted text-sm">
                    Add <span style={{ color: 'var(--gold-solid)' }}>${(500 - subtotal).toLocaleString()}</span> more for free shipping
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}