import { useEffect, useState } from 'react';
import { ChevronDown, SlidersHorizontal, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../lib/supabase';

interface Product {
  id: any;
  name: string;
  price: number;
<<<<<<< HEAD
  image: string; // We'll map product_images[0].url to this
  category: string;
}

interface ShopProps {
  // onNavigate: (page: string, productId?: number) => void; 
  // We can keep onNavigate for compatibility, or switch to useNavigate internally if we wanted. 
  // App.tsx passes it, so we keep it.
  onNavigate: (page: string, productId?: number) => void;
  products?: any[]; // Legacy prop, ignored
=======
  image: string; // Will map from product_images table if needed, or url
  category: string; // Mapped from category logic or table
  description?: string;
}

interface ShopProps {
  onNavigate: (page: string, productId?: any) => void;
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
}

export function Shop({ onNavigate }: ShopProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');

  const categories = ['All', 'Cosmetics', 'Construction', 'Furniture', 'Clothing and Fashion', 'Events Tools', 'Electrical Appliances'];

  useEffect(() => {
    fetchProducts();
<<<<<<< HEAD
  }, [selectedCategory, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          description,
=======
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch products with their images and categories
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
          product_images ( url ),
          product_categories (
            categories ( name )
          )
        `);

<<<<<<< HEAD
      // Filter by category
      if (selectedCategory !== 'All') {
        // This is a bit complex with many-to-many, simplified if products has 'category' column?
        // Schema has 'product_categories'.
        // For simplicity, let's assume valid Supabase join filter or we filter client side if dataset small.
        // OR better: The schema actually has 'product_categories' link table.
        // BUT schema in prompt also shows:
        // CREATE TABLE public.products ( ... brand character varying, ... );
        // It DOES NOT have a 'category' column directly on products.
        // However, the user provided mocked data had 'category'.
        // Let's try to filter by the joined category name if possible, or just filter client side for now to match strict schema.

        // Actually, for "Grade-A" implementation we should do server side.
        // !inner join helps filtering.
        query = query.not('product_categories', 'is', null);
        // We'll filter in the transform step or use a complex query.
        // Let's trying fetching all and filtering client side for MVP or use the join.
      }

      // Sort
      if (sortBy === 'price-low') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price-high') {
        query = query.order('price', { ascending: false });
      } else if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform
      const formatted: Product[] = (data || []).map((item: any) => {
        // Extract category name from join
        const cats = item.product_categories?.map((pc: any) => pc.categories?.name) || [];
        const category = cats[0] || 'Uncategorized';

        return {
          id: item.id, // UUID usually, but interfaces use number?
          // Schema has id as UUID. Interface needs update or we cast if it was number.
          // Let's update interface to allow string ID as supabase uses UUIDs.
          // But wait, existing components might expect number.
          // If schema says uuid, then id is string.
          // We should update the Product interface locally to string | number.
          name: item.name,
          price: item.price,
          image: item.product_images?.[0]?.url || '',
          category
        };
      });

      // Client side category filter if needed (Supabase many-to-many filtering is tricky in one go)
      const filtered = selectedCategory === 'All'
        ? formatted
        : formatted.filter(p => p.category === selectedCategory);

      setProducts(filtered);
    } catch (err) {
      console.error('Error loading products:', err);
=======
      if (error) throw error;

      // Transform data to match component needs
      const transformedProducts = data?.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.product_images?.[0]?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', // Fallback
        category: p.product_categories?.[0]?.categories?.name || 'Uncategorized',
        description: p.description
      })) || [];

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
    } finally {
      setLoading(false);
    }
  };
<<<<<<< HEAD
=======

  const filteredProducts = products
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // 'featured' or 'newest' (assuming default order is fine for now)
    });

  if (loading) {
    return (
      <div className="section flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-[var(--gold-primary)]" size={48} />
      </div>
    );
  }
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2

  return (
    <div className="section">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Luxury Collection</h1>
        <p className="page-desc">
          {products.length} exceptional pieces representing the pinnacle of craftsmanship.
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="filters-container">
        {/* Category Filters */}
        <div className="filter-group">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="sort-container">
          <button className="link-gold" style={{ background: 'none', WebkitBackgroundClip: 'unset', color: 'var(--black)' }}>
            <SlidersHorizontal size={20} strokeWidth={2.5} style={{ marginRight: '0.5rem' }} />
            Filters
          </button>
          <div className="sort-wrapper">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown
              size={16}
              className="sort-icon"
              strokeWidth={3}
            />
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[var(--gold-primary)]" size={48} />
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div className='glass-border' key={product.id}>
              <ProductCard
                product={product as any}
                onProductClick={(id) => onNavigate('product', id)}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No products found under this category.
        </div>
      )}
=======
      {/* Products Grid */}
      <div className="grid grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div className='glass-border' key={product.id}>
            <ProductCard
              product={product}
              onProductClick={(id) => onNavigate('product', id)}
            />
          </div>
        ))}
      </div>
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2

      {/* Load More */}
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <button className="load-more-btn">
          Load More
        </button>
      </div>
    </div>
  );
}