import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ShopProps {
  products: Product[];
  onNavigate: (page: string, productId?: number) => void;
}

export function Shop({ products, onNavigate }: ShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');

  const categories = ['All', 'Cosmetics', 'Construction', 'Furniture', 'Clothing and Fashion', 'Events Tools', 'Electrical Appliances'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="section">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Luxury Collection</h1>
        <p className="page-desc">
          {filteredProducts.length} exceptional pieces representing the pinnacle of craftsmanship.
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

      {/* Products Grid */}
      <div className="grid grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div className='glass-border'>
            <ProductCard
              key={product.id}
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