import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface HomeProps {
  products: Product[];
  onNavigate: (page: string, productId?: number) => void;
}

export function Home({ products, onNavigate }: HomeProps) {
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Redefine Luxury.<br />
          Embrace Excellence.
        </h1>
        <p className="hero-text">
          Discover our curated collection of exceptional pieces that transcend time and trends. Each item is meticulously selected to elevate your lifestyle.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="btn-primary"
        >
          Explore Collection
        </button>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="grid grid-cols-3 gap-12">
            <div className="feature-item">
              <div className="feature-icon-box">
                <Star size={32} strokeWidth={2.5} />
              </div>
              <h4 className="feature-title">Premium Quality</h4>
              <p className="feature-desc">Only the finest materials and craftsmanship</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-box">
                <Shield size={32} strokeWidth={2.5} />
              </div>
              <h4 className="feature-title">Authenticity Guaranteed</h4>
              <p className="feature-desc">Every piece is verified and certified</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-box">
                <Truck size={32} strokeWidth={2.5} />
              </div>
              <h4 className="feature-title">White Glove Delivery</h4>
              <p className="feature-desc">Complimentary luxury shipping worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Collection</h2>
          <button
            onClick={() => onNavigate('shop')}
            className="link-gold"
          >
            View All
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={(id) => onNavigate('product', id)}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Join the Elite</h2>
          <p className="cta-text">
            Subscribe to receive exclusive access to limited editions, private sales, and curated recommendations.
          </p>
          <div className="cta-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field"
            />
            <button className="btn-primary">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}