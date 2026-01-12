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
import { About } from './pages/About';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { SeasonProvider } from './context/SeasonContext';

import { GlobalNotifications } from './components/GlobalNotifications';
import { SeasonalOverlay } from './components/SeasonalOverlay';
import { GreetingModal } from './components/GreetingModal';

// Header Wrapper to use Cart Context
const HeaderWrapper = () => {
  const { itemCount } = useCart();
  return <Header cartItemCount={itemCount} />;
};

export default function App() {
  const navigate = useNavigate();

  const handleNavigate = (page: string, productId?: number) => {
    if (page === 'product' && productId) {
      navigate(`/product/${productId}`);
    } else {
      navigate(page === 'home' ? '/' : `/${page}`);
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <SeasonProvider>
          <SeasonalOverlay />
          <GreetingModal />
          <GlobalNotifications />
          <div className="min-h-screen flex flex-col">
            <HeaderWrapper />

            <main className="grow">
              <Routes>
                <Route path="/" element={<Home onNavigate={handleNavigate} />} />
                <Route path="/shop" element={<Shop onNavigate={handleNavigate} />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart onNavigate={handleNavigate} />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<Account />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Home onNavigate={handleNavigate} />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </SeasonProvider>
      </CartProvider>
    </AuthProvider>
  );
}
