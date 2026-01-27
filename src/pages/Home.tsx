import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LuxuryCategoryCard } from '../components/home/LuxuryCategoryCard';
import { ProductSection } from '../components/home/ProductSection';

// Keep the Product interface here for data fetching typing, or move to a types file
interface Product {
  id: any;
  name: string;
  price: number;
  stock: number;
  brand?: string;
  sku?: string;
  short_description?: string;
  description?: string;
  image?: string;
  product_images?: { url: string; alt_text?: string; position?: number }[];
  category: string;
  product_specs?: { spec_key: string; spec_value: string }[];
  view_count?: number;
}

interface Category {
  id: string;
  name: string;
}

const PRODUCTS_PER_SECTION = 8;

export function Home() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [electronicsProducts, setElectronicsProducts] = useState<Product[]>([]);
  const [fashionProducts, setFashionProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const recommendedSeedRef = useRef(Math.random());
  // Removed categoryCarouselIndex state and ref as it's now handled internally by LuxuryCategoryCard

  // Fetch products
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images ( url, alt_text, position ),
          product_categories (
            categories ( name )
          ),
          product_specs ( spec_key, spec_value )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data
      const transformedProducts = data?.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        stock: p.stock || 0,
        brand: p.brand,
        sku: p.sku,
        short_description: p.short_description,
        description: p.description,
        image: p.product_images?.sort((a: any, b: any) => a.position - b.position)[0]?.url,
        product_images: p.product_images?.sort((a: any, b: any) => a.position - b.position) || [],
        category: p.product_categories?.[0]?.categories?.name || 'Uncategorized',
        product_specs: p.product_specs || [],
        view_count: p.view_count || 0,
      })) || [];

      setAllProducts(transformedProducts);
      return transformedProducts;
    } catch (err) {
      console.error('Error fetching products:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Process products after fetching
  const processProducts = (products: Product[]) => {
    // Filter products with images only
    const productsWithImages = products.filter(p => p.image && p.image.trim() !== '');

    // Trending: sorted by view_count
    const trending = [...productsWithImages]
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, PRODUCTS_PER_SECTION);
    setTrendingProducts(trending);

    // Recommended: randomized with session seed
    const seed = recommendedSeedRef.current;
    const recommended = [...productsWithImages]
      .sort(() => Math.sin(seed * (Math.random() + 1)) - 0.5)
      .slice(0, PRODUCTS_PER_SECTION);
    setRecommendedProducts(recommended);

    // Electronics: filtered by category with images
    const electronics = productsWithImages
      .filter(p => p.category === 'Electrical Appliances')
      .slice(0, PRODUCTS_PER_SECTION);
    setElectronicsProducts(electronics);

    // Fashion: filtered by category with images
    const fashion = productsWithImages
      .filter(p => p.category === 'Clothing and Fashion')
      .slice(0, PRODUCTS_PER_SECTION);
    setFashionProducts(fashion);
  };

  // Load all data on mount
  useEffect(() => {
    const loadAllData = async () => {
      await fetchCategories();
      const products = await fetchAllProducts();
      processProducts(products);
    };

    loadAllData();
  }, []);

  // Removed the setInterval auto-rotate effect for carousels

  return (
    <main className="bg-white">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes goldGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.2);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .animate-gold-glow {
          animation: goldGlow 3s ease-in-out infinite;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* ================= LUXURY HERO BANNER ================= */}
      <section className="relative w-full h-[480px] bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] overflow-hidden group">
        {/* Background image with luxury overlay */}
        <div className="absolute inset-0">
          <img
            src="https://via.placeholder.com/1600x600"
            alt="Hero Ad"
            className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700"
          />
        </div>

        {/* Premium luxury gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F]/90 via-[#1A1A1A]/70 to-[#0F0F0F]/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFE55C]/10 via-transparent to-[#D4AF37]/5" />

        {/* Animated gold accent lights */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#FFE55C] rounded-full mix-blend-screen filter blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#D4AF37] rounded-full mix-blend-screen filter blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center px-8 lg:px-16 z-10">
          <div
            className="max-w-2xl"
            style={{ animation: 'slideUp 0.8s ease-out' }}
          >
            <div className="inline-block mb-6">
              <span className="text-[#FFE55C] text-sm font-extrabold uppercase tracking-widest bg-[rgba(212,175,55,0.1)] px-4 py-2 rounded-full border border-[rgba(212,175,55,0.3)]">
                ✨ Premium Collection
              </span>
            </div>
            <h1 className="text-6xl lg:text-7xl mb-6 leading-tight text-white font-extrabold" style={{ fontFamily: 'dosis' }}>
              Discover <span className="bg-gradient-to-r from-[#FFE55C] via-[#D4AF37] to-[#B8941F] bg-clip-text text-transparent">Luxury</span>
            </h1>
            <p className="text-xl text-[#D0D0D0] mb-10 leading-relaxed opacity-90">
              Explore our curated collection of premium products. Every item selected for quality, style, and elegance.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="relative group/btn inline-block"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FFE55C] via-[#D4AF37] to-[#B8941F] rounded-[14px] opacity-50 group-hover/btn:opacity-100 blur transition duration-500 group-hover/btn:duration-200" />
              <div className="relative bg-gradient-to-r from-[#FFE55C] via-[#D4AF37] to-[#B8941F] text-[#050505] px-10 py-4 rounded-[12px] font-extrabold text-lg hover:shadow-[0_20px_40px_rgba(212,175,55,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95">
                Start Shopping Now
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ================= LUXURY CATEGORY GRID ================= */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20">
        {/* Top gold divider */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50 mb-16" />

        <div className="mb-12">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#FFE55C] via-[#D4AF37] to-[#B8941F] bg-clip-text text-transparent" style={{ fontFamily: 'dosis' }}>
            Shop by Category
          </h2>
          <div className="h-[3px] w-24 bg-gradient-to-r from-[#FFE55C] via-[#D4AF37] to-[#B8941F] rounded-full mt-4 shadow-lg shadow-[#D4AF37]/30" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-[16px] h-40 bg-slate-100 animate-pulse" />
            ))
          ) : categories.filter(cat => allProducts.some(p => p.category === cat.name && p.image && p.image.trim() !== '')).length > 0 ? (
            categories
              .filter(cat => allProducts.some(p => p.category === cat.name && p.image && p.image.trim() !== ''))
              .map((cat) => (
                <LuxuryCategoryCard
                  key={cat.id}
                  category={cat}
                  products={allProducts}
                />
              ))
          ) : (
            <p className="col-span-full text-slate-500">No categories with images found</p>
          )}
        </div>
      </section>

      {/* ================= LUXURY MID-PAGE PROMOTIONAL BANNER ================= */}
      <section className="w-full bg-gradient-to-b from-[rgba(255,229,92,0.05)] via-white to-[rgba(212,175,55,0.03)] py-12 border-y border-[rgba(212,175,55,0.2)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="relative rounded-[24px] overflow-hidden group cursor-pointer border-2 border-[rgba(212,175,55,0.3)] hover:border-[rgba(212,175,55,0.8)] transition-all duration-500">
            <img
              src="https://via.placeholder.com/1400x300"
              alt="Mid Ad"
              className="w-full rounded-[22px] group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/40 via-transparent to-[#D4AF37]/30 group-hover:from-[#D4AF37]/60 group-hover:via-[#D4AF37]/20 group-hover:to-[#D4AF37]/50 transition-all duration-500 rounded-[22px]" />
          </div>
        </div>
      </section>

      {/* ================= TRENDING PRODUCTS ================= */}
      {trendingProducts.length > 0 && (
        <ProductSection
          title="🔥 Trending Products"
          products={trendingProducts}
          index={0}
          loading={loading}
          productsPerSection={PRODUCTS_PER_SECTION}
        />
      )}

      {/* ================= RECOMMENDED FOR YOU ================= */}
      {recommendedProducts.length > 0 && (
        <ProductSection
          title="💎 Recommended For You"

          products={recommendedProducts}
          index={1}
          loading={loading}
          productsPerSection={PRODUCTS_PER_SECTION}

        />
      )}

      {/* ================= ELECTRONICS PICKS ================= */}
      {electronicsProducts.length > 0 && (
        <ProductSection
          title="⚡ Electronics Picks"
          products={electronicsProducts}
          categoryName="Electrical Appliances"
          index={2}
          loading={loading}
          productsPerSection={PRODUCTS_PER_SECTION}

        />
      )}

      {/* ================= FASHION ESSENTIALS ================= */}
      {fashionProducts.length > 0 && (
        <ProductSection
          title="👗 Fashion Essentials"
          products={fashionProducts}
          categoryName="Clothing and Fashion"
          index={3}
          loading={loading}
          productsPerSection={PRODUCTS_PER_SECTION}

        />
      )}

      {/* ================= LUXURY FULL WIDTH AD ================= */}
      <section className="w-full py-20 bg-gradient-to-b from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] relative overflow-hidden group">
        {/* Decorative gold accent lights */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#FFE55C] rounded-full mix-blend-screen filter blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-[#D4AF37] rounded-full mix-blend-screen filter blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="relative rounded-[24px] overflow-hidden group cursor-pointer border-2 border-[rgba(212,175,55,0.3)] hover:border-[rgba(212,175,55,0.8)] transition-all duration-500">
            <img
              src="https://via.placeholder.com/1600x400"
              alt="Bottom Ad"
              className="w-full rounded-[22px] group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFE55C]/50 via-[#D4AF37]/30 to-[#B8941F]/50 group-hover:from-[#FFE55C]/70 group-hover:via-[#D4AF37]/50 group-hover:to-[#B8941F]/70 transition-all duration-500 rounded-[22px]" />
          </div>
        </div>
      </section>
    </main>
  );
}
