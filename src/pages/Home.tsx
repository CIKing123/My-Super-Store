import { useEffect, useState } from 'react';
<<<<<<< HEAD
import { ArrowRight, Star, Shield, Truck, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../lib/supabase';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface HomeProps {
  products: Product[]; // Legacy, ignored
  onNavigate: (page: string, productId?: number) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      // Fetch 4 featured products (e.g. random or just latest)
      const { data, error } = await supabase
        .from('products')
        .select(`
                *,
                product_images ( url ),
                product_categories (
                    categories ( name )
                )
            `)
        .limit(4);

      if (error) throw error;

      const formatted = (data || []).map((item: any) => {
        const cats = item.product_categories?.map((pc: any) => pc.categories?.name) || [];
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.product_images?.[0]?.url || '',
          category: cats[0] || 'Uncategorized'
        };
      });

      setFeaturedProducts(formatted);
    } catch (err) {
      console.error('Error fetching featured products:', err);
    } finally {
      setLoading(false);
    }
  };
=======
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string, productId?: any) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('*, product_images(url), product_categories(categories(name))')
          .limit(4);

        if (data) {
          setFeaturedProducts(data.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.product_images?.[0]?.url || 'https://via.placeholder.com/500',
            category: p.product_categories?.[0]?.categories?.name
          })));
        }
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2

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

      {/* Featured Section */}
      <div className="section">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif text-white mb-4">Featured Collection</h2>
            <p className="text-muted max-w-xl">
              Curated selection of our most exclusive pieces, designed for the discerning few.
            </p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="link-gold"
          >
            View All Collection
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {loading ? (
            // Simple skeleton loading
            [1, 2, 3, 4].map(i => <div key={i} className="h-96 bg-white/5 rounded-lg animate-pulse" />)
          ) : (
            featuredProducts.map((product) => (
              <div className='glass-border' key={product.id}>
                <ProductCard
                  product={product}
                  onProductClick={(id) => onNavigate('product', id)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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

<<<<<<< HEAD
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

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[var(--gold-primary)]" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="glass-border">
                <ProductCard
                  product={product as any}
                  onProductClick={(id) => onNavigate('product', id)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

=======
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Join the Elite</h2>
          <p className="cta-text">
            Subscribe to receive exclusive access to limited editions, private sales, and curated recommendations.
          </p>
          <div className="cta-form flex flex-col md:flex-row gap-4 justify-center items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field p-4 rounded w-full md:w-96 text-black"
            />
            <button className="btn-primary w-full md:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}