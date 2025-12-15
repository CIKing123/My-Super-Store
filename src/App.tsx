import { Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Login } from './pages/Login';
import { Account } from './pages/Account';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

function AppContent() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleNavigate = (page: string, productId?: number) => {
    if (page === 'product' && productId) {
      navigate(`/product/${productId}`);
    } else {
      navigate(page === 'home' ? '/' : `/${page}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home products={[]} onNavigate={handleNavigate} />} />
          <Route path="/shop" element={<Shop products={[]} onNavigate={handleNavigate} />} />
          <Route path="/product/:id" element={<ProductDetailWrapper />} />
          <Route path="/cart" element={<Cart onNavigate={handleNavigate} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          {/* Fallback */}
          <Route path="*" element={<Home products={[]} onNavigate={handleNavigate} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function ProductDetailWrapper() {
  // We'll update ProductDetail to fetch its own data, so this wrapper is less important
  // but we can keep it simple for now or let ProductDetail handle params.
  // Actually, let's keep it simple and just render ProductDetail which we will refactor.
  return <ProductDetail />;
}


export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
