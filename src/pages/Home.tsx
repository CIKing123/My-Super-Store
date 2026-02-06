import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LuxuryCategoryCard } from '../components/home/LuxuryCategoryCard';
import { ProductSection } from '../components/home/ProductSection';
import { HeroCarousel } from '../components/home/HeroCarousel';

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
      <section className="relative w-full h-[400px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[700px] 2xl:h-[750px] bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] overflow-hidden group">
        {/* Auto-sliding carousel background */}
        <HeroCarousel />

        {/* Content */}
        <div className="absolute inset-0 flex items-start sm:items-center px-3 py-4 sm:px-6 md:px-8 lg:px-16 z-10">
          <div
            className="w-full max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-2xl bg-black/40 backdrop-blur-sm p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg md:rounded-xl lg:rounded-2xl"
            style={{ animation: 'slideUp 0.8s ease-out' }}
          >
            <div className="inline-block mb-2 sm:mb-3 md:mb-4 lg:mb-6">
              <span className="text-[10px] sm:text-xs md:text-sm font-bold sm:font-extrabold uppercase tracking-wider sm:tracking-widest bg-[rgba(212,175,55,0.25)] px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full border border-[rgba(212,175,55,0.6)] shadow-md">
                ✨ Premium
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight text-white font-extrabold" style={{ fontFamily: 'dosis', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
              Discover <span className="bg-gradient-to-r from-[#FFE55C] via-[#D4AF37] to-[#B8941F] bg-clip-text text-transparent" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>Luxury</span>
            </h1>
            <p className="hidden sm:block text-sm md:text-base lg:text-lg xl:text-xl text-white mb-4 md:mb-6 lg:mb-8 xl:mb-10 leading-relaxed" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
              Explore our curated collection of premium products.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="relative group/btn inline-block w-full"
            >
              <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-[#FFE55C] via-[#D4AF37] to-[#B8941F] rounded-lg sm:rounded-xl opacity-50 group-hover/btn:opacity-100 blur transition duration-500 group-hover/btn:duration-200" />
              <div className="relative bg-gradient-to-r from-[#FFE55C] via-[#D4AF37] to-[#B8941F] text-[#050505] px-4 py-2 sm:px-5 sm:py-2.5 md:px-8 md:py-3 lg:px-10 lg:py-4 rounded-lg sm:rounded-xl font-extrabold text-xs sm:text-sm md:text-base lg:text-lg hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] sm:hover:shadow-[0_20px_40px_rgba(212,175,55,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95 text-center">
                Shop Now
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ================= LUXURY CATEGORY GRID ================= */}
      <section className="w-full max-w-[4000px]  mx-auto ">
        {/* Top gold divider */}
        <div className="h-[4px] bg-gradient-to-r  from-[rgba(95,82,17,0.71)] via-[#D4AF37] to-[rgba(46,38,0,0.94)] opacity-50 mb-20" />

        <div className="relative mb-20 bg-black py-12 px-6 lg:px-10 ">
          <h2 style={{ fontFamily: 'revert' }} className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-[#FFE55C] via-[#D4AF37] to-[#B8941F] bg-clip-text text-transparent" >
            Shop by Category
          </h2>

          <div className="h-[4px]  w-48 bg-gradient-to-r from-[#FFE55C] via-[#D4AF37] to-[#B8941F] rounded-full mt-6 shadow-lg shadow-[#D4AF37]/40 " />
        </div>



        <div className="py-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
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
      <section className="w-full bg-gradient-to-b max-w-[4000px] from-[rgba(255,229,92,0.05)] via-white to-[rgba(212,175,55,0.03)] py-12 border-y border-[rgba(212,175,55,0.2)]">
        <div className=" mx-auto px-6 lg:px-10">
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
