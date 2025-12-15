import { useState } from 'react';
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

// Mock Data
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  // COSMETICS
  {
    id: 1,
    name: 'Radiant Glow Serum',
    price: 145,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    category: 'Cosmetics',
    description: 'Premium anti-aging serum with 24K gold particles and hyaluronic acid. Reduces fine lines and promotes radiant skin.',
  },
  {
    id: 2,
    name: 'Luxury Makeup Palette',
    price: 89,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
    category: 'Cosmetics',
    description: 'Professional 48-color eyeshadow palette with matte and shimmer finishes. Highly pigmented and long-lasting.',
  },
  {
    id: 3,
    name: 'Diamond Lip Gloss Set',
    price: 65,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
    category: 'Cosmetics',
    description: 'Set of 6 luxurious lip glosses with diamond shimmer. Non-sticky formula with vitamin E.',
  },
  {
    id: 4,
    name: 'Premium Skincare Kit',
    price: 220,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    category: 'Cosmetics',
    description: 'Complete 5-step skincare routine with cleanser, toner, serum, moisturizer, and night cream.',
  },

  // CONSTRUCTION
  {
    id: 5,
    name: 'Professional Power Drill Set',
    price: 350,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80',
    category: 'Construction',
    description: 'Cordless 20V drill with 50-piece accessory kit. Includes carrying case and dual batteries.',
  },
  {
    id: 6,
    name: 'Premium Tool Chest',
    price: 890,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
    category: 'Construction',
    description: 'Heavy-duty steel tool chest with 12 drawers. Ball-bearing slides and powder-coated finish.',
  },
  {
    id: 7,
    name: 'Laser Level System',
    price: 275,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
    category: 'Construction',
    description: 'Self-leveling rotary laser with tripod and detector. Accurate to 1/8 inch at 100 feet.',
  },
  {
    id: 8,
    name: 'Circular Saw Pro',
    price: 420,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80',
    category: 'Construction',
    description: '15-amp circular saw with laser guide and LED light. Cuts through 2x material at 45 degrees.',
  },

  // FURNITURE
  {
    id: 9,
    name: 'Executive Leather Chair',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
    category: 'Furniture',
    description: 'Ergonomic office chair with genuine Italian leather. Adjustable lumbar support and armrests.',
  },
  {
    id: 10,
    name: 'Modern Dining Table',
    price: 2400,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
    category: 'Furniture',
    description: 'Solid walnut dining table seats 8. Hand-finished with natural oil and wax.',
  },
  {
    id: 11,
    name: 'Velvet Sofa Set',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    category: 'Furniture',
    description: 'Luxury 3-seater sofa in emerald velvet. Solid oak frame with gold-finished legs.',
  },
  {
    id: 12,
    name: 'Glass Coffee Table',
    price: 680,
    image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800&q=80',
    category: 'Furniture',
    description: 'Tempered glass top with brass geometric base. Modern minimalist design.',
  },

  // CLOTHING AND FASHION
  {
    id: 13,
    name: 'Designer Leather Jacket',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    category: 'Clothing and Fashion',
    description: 'Premium lambskin leather jacket with quilted lining. Classic biker style with YKK zippers.',
  },
  {
    id: 14,
    name: 'Silk Evening Gown',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    category: 'Clothing and Fashion',
    description: 'Floor-length silk gown with hand-beaded bodice. Available in midnight blue and champagne.',
  },
  {
    id: 15,
    name: 'Cashmere Sweater',
    price: 420,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    category: 'Clothing and Fashion',
    description: '100% pure cashmere V-neck sweater. Lightweight yet warm, perfect for layering.',
  },
  {
    id: 16,
    name: 'Designer Handbag',
    price: 3400,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    category: 'Clothing and Fashion',
    description: 'Iconic quilted leather handbag with chain strap. Signature gold hardware.',
  },

  // EVENTS TOOLS
  {
    id: 17,
    name: 'Professional Fireworks Kit',
    price: 850,
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80',
    category: 'Events Tools',
    description: 'Premium fireworks display package. Includes 50 aerial shells and safety equipment. License required.',
  },
  {
    id: 18,
    name: 'LED Stage Lighting Set',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    category: 'Events Tools',
    description: 'Professional RGB LED par lights with DMX control. Set of 8 with mounting brackets.',
  },
  {
    id: 19,
    name: 'Smoke Machine Pro',
    price: 380,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    category: 'Events Tools',
    description: '1500W fog machine with wireless remote. Includes 1 gallon of premium fog fluid.',
  },
  {
    id: 20,
    name: 'Confetti Cannon Set',
    price: 145,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    category: 'Events Tools',
    description: 'Pack of 6 electric confetti cannons. Biodegradable metallic confetti in gold and silver.',
  },

  // ELECTRICAL APPLIANCES
  {
    id: 21,
    name: 'Smart Refrigerator',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80',
    category: 'Electrical Appliances',
    description: '4-door French door refrigerator with touchscreen. WiFi-enabled with internal cameras.',
  },
  {
    id: 22,
    name: 'Premium Coffee Maker',
    price: 890,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
    category: 'Electrical Appliances',
    description: 'Automatic espresso machine with built-in grinder. 15-bar pressure pump and milk frother.',
  },
  {
    id: 23,
    name: 'Air Purifier Pro',
    price: 650,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
    category: 'Electrical Appliances',
    description: 'HEPA air purifier covers 1000 sq ft. Smart sensor with air quality display and app control.',
  },
  {
    id: 24,
    name: 'Robot Vacuum Cleaner',
    price: 720,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
    category: 'Electrical Appliances',
    description: 'Smart robot vacuum with mapping technology. Self-emptying base and 2-hour runtime.',
  },
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  const handleNavigate = (page: string, productId?: number) => {
    // Legacy support for Home.tsx props - in a real refactor, components would use Link or navigate directly
    if (page === 'product' && productId) {
      navigate(`/product/${productId}`);
    } else {
      navigate(page === 'home' ? '/' : `/${page}`);
    }
  };

  const handleAddToCart = (productId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });

    // Simple feedback
    alert('Added to cart!');
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const WrapperProductDetail = () => {
    // Very simple wrapper to get ID from URL params since we don't have a route wrapper component yet
    // In a real app we'd use useParams() inside ProductDetail
    // For now, let's just make ProductDetail handle useParams or pass it here.
    // To keep it simple without changing ProductDetail signature too much yet:
    const path = window.location.pathname;
    const id = parseInt(path.split('/').pop() || '0');
    const product = products.find(p => p.id === id);

    if (!product) return <div>Product not found</div>;

    return <ProductDetail product={product} onAddToCart={handleAddToCart} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home products={products} onNavigate={handleNavigate} />} />
          <Route path="/shop" element={<Shop products={products} onNavigate={handleNavigate} />} />
          <Route path="/product/:id" element={<WrapperProductDetail />} />
          <Route path="/cart" element={
            <Cart
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onNavigate={handleNavigate}
            />
          } />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          {/* Fallback */}
          <Route path="*" element={<Home products={products} onNavigate={handleNavigate} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
