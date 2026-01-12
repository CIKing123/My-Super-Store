import { useEffect, useState } from 'react';
import { ChevronDown, SlidersHorizontal, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

import { supabase } from '../lib/supabase';

interface Product {
  id: any;
  name: string;
  price: number;
  image?: string;
  product_images?: { url: string }[];
  category: string; // Mapped from category logic or table
  description?: string;
}

interface ShopProps {
  onNavigate: (page: string, productId?: any) => void;
}

export function Shop({ onNavigate }: ShopProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchParams] = useSearchParams();

  const categories = ['All', 'Cosmetics', 'Construction', 'Furniture', 'Clothing and Fashion', 'Events Tools', 'Electrical Appliances'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
  const categoryFromUrl = searchParams.get('category');

  if (categoryFromUrl) {
    setSelectedCategory(categoryFromUrl);
  } else {
    setSelectedCategory('All');
  }
}, [searchParams]);


  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch products with their images and categories
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images ( url ),
          product_categories (
            categories ( name )
          )
        `);

      if (error) throw error;

      // Transform data to match component needs
      const transformedProducts = data?.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: undefined,
        product_images: p.product_images,
        category: p.product_categories?.[0]?.categories?.name || 'Uncategorized',
        description: p.description
      })) || [];

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="page-fade section relative">
      {/* Header with Particles Behind */}
      <div className="relative min-h-[300px] flex items-center justify-center -mx-8 -mt-8 px-8 pt-8 mb-8" style={{ overflow: 'hidden' }}>
        <div className="absolute inset-0 z-0">
          
        </div>
        <div className="relative z-10 text-center">
          <h1 className="page-title">Luxury Collection</h1>
          <p className="page-desc">
            {filteredProducts.length} exceptional pieces representing the pinnacle of craftsmanship.
          </p>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="filters-container">
        {/* Category Filters */}
        <div className="filter-group">
          {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);

              if (category === 'All') {
                searchParams.delete('category');
                setSearchParams(searchParams);
              } else {
                setSearchParams({ category });
              }
            }}
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

      {/* Load More */}
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <button className="load-more-btn">
          Load More
        </button>
      </div>
    </div>
  );
}