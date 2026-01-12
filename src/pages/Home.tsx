import { useEffect, useState } from 'react';

import { ProductCarousel } from '../components/ProductCarousel';
import TypingText from '../components/TypingText';
import Reveal from '../components/Reveal';
import { supabase } from '../lib/supabase';
import { Star, Shield, Truck, Tv2, Glasses, ChevronRight, Construction } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string, productId?: any) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetch ALL published products for general users (not filtered by vendor)
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images (url, alt_text, position),
            product_categories (
              categories (name)
            )
          `)
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Home - Fetched products:', data?.length); // Debug log

        if (data) {
          setFeaturedProducts(data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            stock: p.stock || 0,
            brand: p.brand,
            short_description: p.short_description,
            image: p.product_images?.sort((a: any, b: any) => (a.position || 0) - (b.position || 0))[0]?.url,
            product_images: p.product_images?.sort((a: any, b: any) => (a.position || 0) - (b.position || 0)) || [],
            category: p.product_categories?.[0]?.categories?.name || 'Uncategorized'
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

  return (
    <div>
      {/* Hero Section - Luxury Design */}
      <main className="flex-grow flex items-center justify-center w-full py-12 lg:py-20 px-6 lg:px-10">
        <div className="w-full max-w-[1280px]">

          <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-32">
            {/* Content Column */}
            <div className="flex flex-col gap-8 flex-1 w-full lg:max-w-[50%]">
              <div className="flex flex-col gap-4 text-left">
                {/* Badge */}
                <div className="flex items-center gap-2">
                  <span className="h-[1px] w-8 bg-[#d4af37]"></span>
                  <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">Est. 2024</span>
                </div>

                {/* Main Title with Typing Animation */}
                <h1 className="text-slate-900 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-[-0.02em]"
                style={{
    textShadow: `
      0 0 6px rgba(236, 211, 141, 0.03),
      0 0 14px rgba(231, 227, 214, 0.36)
    `
  }}>
                  <TypingText texts={["Collect the Exceptional.", "Embrace Luxury.", "Redefine Excellence."]} />
                </h1>

                {/* Description */}
                <p className="text-slate-1500 text-lg sm:text-xl font-medium leading-relaxed max-w-[540px]">
                  Discover a curated selection of artifacts designed for the few, not the many. Elevate your everyday with unparalleled craftsmanship.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-4">
                {/* Primary CTA with Gold Gradient */}
                <button
                  onClick={() => onNavigate('shop')}
                  className="group relative flex items-center justify-center overflow-hidden rounded-lg h-14 px-8 min-w-[180px] bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] shadow-lg shadow-[#d4af37]/20 transition-transform active:scale-95 hover:shadow-xl hover:shadow-[#d4af37]/30"
                >
                  <span className="relative z-10 text-white text-base font-bold tracking-wide uppercase">Shop Collection</span>
                  {/* Shine effect overlay */}
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out"></div>
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={() => onNavigate('shop')}
                  className="flex items-center justify-center rounded-lg h-14 px-8 min-w-[180px] bg-white border border-slate-200 text-slate-900 text-base font-bold tracking-wide uppercase hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <span>Explore More</span>
                </button>

                {/* Vendor Dashboard CTA */}
                <button
                  onClick={() => onNavigate('vendor/dashboard')}
                  className="flex items-center gap-2 justify-center rounded-lg h-14 px-8 min-w-[180px] bg-slate-900 text-white text-base font-bold tracking-wide uppercase hover:bg-slate-800 transition-all border border-slate-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>Vendor Portal</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 mt-4 pt-8 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">{featuredProducts.length}+</span>
                  <span className="text-sm text-slate-500 font-medium">Exclusive Items</span>
                </div>
                <div className="w-[1px] h-10 bg-slate-200"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">Global</span>
                  <span className="text-sm text-slate-500 font-medium">Shipping Available</span>
                </div>
              </div>
            </div>

            {/* Image Column with Featured Product */}
            <div className="relative w-full lg:flex-1 h-auto aspect-[4/5] lg:aspect-square max-h-[700px]">
              {/* Main Product Image Container */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-100 shadow-2xl">
                {/* Animated Particles Behind */}
                <div className="absolute inset-0 z-0">

                </div>

                {/* Image or Placeholder */}
                <div className="relative z-10 w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                  {featuredProducts.length > 0 && featuredProducts[0].product_images?.length > 0 ? (
                    <img
                      alt={featuredProducts[0].name}
                      className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                      src={featuredProducts[0].product_images[0].url}
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-4">✨</div>
                      <p className="text-slate-400">Premium Collection</p>
                    </div>
                  )}
                </div>

                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 flex items-center justify-between z-20">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Featured Collection</p>
                    <p className="text-slate-900 font-bold text-lg">{featuredProducts.length > 0 ? featuredProducts[0].name : 'Luxury Items'}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('product', featuredProducts[0]?.id)}
                    className="size-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Decorative Abstract Shape */}
              <div className="absolute -z-10 -top-6 -right-6 w-full h-full border border-[#d4af37]/30 rounded-2xl hidden lg:block"></div>
            </div>
          </div>
        </div>
      </main>

      {/*What we deliver*/}

      {/* We Deliver – Industry Partnerships */}
      <section className="relative py-20 px-6 lg:px-10 bg-black overflow-hidden">
        {/* Top metallic border */}
        <div className="absolute top-0 left-0 right-0 h-2
    bg-gradient-to-r
    from-[#5d4300]
    via-[#8b5e00]
    via-[#b67f00]
    via-[#f6dd6a]
    via-[#b67f00]
    via-[#8b5e00]
    to-[#5d4300]"
        />

        {/* Bottom metallic border */}
        <div className="absolute bottom-0 left-0 right-0 h-2
    bg-gradient-to-r
    from-[#5d4300]
    via-[#8b5e00]
    via-[#b67f00]
    via-[#f6dd6a]
    via-[#b67f00]
    via-[#8b5e00]
    to-[#5d4300]"
        />

        <div className="flex flex-wrap justify-center gap-8">

          {/* Header */}
          <div className='flex'>
            <div className="p-7 mb-16 max-w-2xl text-center mx-auto">
              <h2 className="text-3xl text-center font-serif text-[#f3f3f3] mb-4">
                We Deliver
              </h2>
              <p className="text-slate-100 leading-relaxed">
                We have partnered with multiple industries to deliver all these fine products
                to our customers, providing a seamless sourcing and delivery experience across
                diverse categories.
              </p>
            </div>
          </div>

          {/* Horizontal Flex Grid - Centered on Desktop */}
          <div className='flex flex-wrap md:flex-nowrap justify-center gap-8'>

            {/* Card 1 */}
            <div className="w-full md:flex-1 max-w-[400px] flex flex-col gap-4 p-8 rounded-xl border border-[#D4AF37]
              transition-all duration-300
              hover:shadow-[0_0_30px_rgba(212,175,55,0.45)]
              hover:-translate-y-1">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#D4AF37]/15 text-[#D4AF37]">
                <Glasses size={26} />
              </div>
              <h4 className="text-lg font-semibold text-slate-200">Cosmetics & Beauty Products</h4>
              <p className="text-sm text-slate-100 leading-relaxed">
                Explore premium cosmetics, skincare, fragrances, and personal care products
                sourced from trusted manufacturers and suppliers.
              </p>
            </div>

            {/* Card 2 */}
            <div className="w-full md:flex-1 max-w-[400px] flex flex-col gap-4 p-8 rounded-xl border border-[#D4AF37]
        transition-all duration-300
        hover:shadow-[0_0_30px_rgba(212,175,55,0.45)]
        hover:-translate-y-1">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#D4AF37]/15 text-[#D4AF37]">
                <Construction size={26} />
              </div>
              <h4 className="text-lg font-semibold text-slate-200">Building Materials</h4>
              <p className="text-sm text-slate-100 leading-relaxed">
                Source durable construction materials including structural, finishing, and
                industrial-grade supplies for residential and commercial projects.
              </p>
            </div>

            {/* Card 3 */}
            <div className="w-full md:flex-1 max-w-[400px] flex flex-col gap-4 p-8 rounded-xl border border-[#D4AF37]
        transition-all duration-300
        hover:shadow-[0_0_30px_rgba(212,175,55,0.45)]
        hover:-translate-y-1">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#D4AF37]/15 text-[#D4AF37]">
                <Tv2 size={26} />
              </div>
              <h4 className="text-lg font-semibold text-slate-200">Electrical Appliances</h4>
              <p className="text-sm text-slate-100 leading-relaxed">
                Discover reliable electrical and electronic appliances designed for homes,
                offices, and industrial applications.
              </p>
            </div>

          </div>
        </div>
      </section>







      {/* Featured Section */}
      <div className="section">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif text-[#D4AF37] mb-4">Featured Collection</h2>
            <p className="text-muted max-w-xl">
              Curated selection of our most exclusive pieces, designed for the discerning few.
            </p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="link-gold"
          >
            View All Collection →
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[100px]">
            <div className="text-center text-muted">Loading Products...</div>
          </div>
        ) : (
          <ProductCarousel
            products={featuredProducts}
            onProductClick={(id) => onNavigate('product', id)}
          />
        )}
      </div>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="grid grid-cols-3 gap-12">
            <Reveal className="feature-item">
              <div className="feature-icon-box">
                <Star size={32} strokeWidth={2.5} />
              </div>
              <h4 className="feature-title">Premium Quality</h4>
              <p className="feature-desc">Only the finest materials and craftsmanship</p>
            </Reveal>

            <Reveal className="feature-item">
              <div className="feature-icon-box">
                <Shield size={32} strokeWidth={2.5} />
              </div>
              <h4 className="feature-title">Authenticity Guaranteed</h4>
              <p className="feature-desc">Every piece is verified and certified</p>
            </Reveal>

            <Reveal className="feature-item">
              <div className="feature-icon-box">
                <Truck size={32} strokeWidth={2.5} />
              </div>
              <h4 className="feature-title">White Glove Delivery</h4>
              <p className="feature-desc">Complimentary luxury shipping worldwide</p>
            </Reveal>
          </div>
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