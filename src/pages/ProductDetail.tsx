import { useState } from 'react';
import { Heart, Truck, Shield, RotateCcw, Star, Minus, Plus } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

interface ProductDetailProps {
  product: Product;
  onAddToCart: (productId: number, quantity: number) => void;
}

export function ProductDetail({ product, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('One Size');

  const sizes = ['Small', 'Medium', 'Large', 'One Size'];

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
  };

  return (
    <div className="section">
      <div className="detail-grid">
        {/* Product Images - Left Column on White */}
        <div>
          <div className="gallery-main">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="product-image"
            />
          </div>
          <div className="gallery-thumbnails">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="gallery-thumb">
                <ImageWithFallback
                  src={product.image}
                  alt={`${product.name} view ${i}`}
                  className="product-image"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info - Right Column Black Card */}
        <div className="card-black">
          <p className="text-muted mb-2">{product.category}</p>
          <h1 className="text-white mb-6" style={{ fontSize: '2.5rem' }}>{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  strokeWidth={2.5}
                  style={{
                    fill: 'url(#gold-gradient)',
                    stroke: '#D4AF37',
                    filter: 'drop-shadow(0 0 4px rgba(244, 224, 77, 0.5))'
                  }}
                />
              ))}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE55C" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#B8941F" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-muted">(127 reviews)</span>
          </div>

          {/* Price */}
          <span className="detail-price">
            ${product.price.toLocaleString()}
          </span>

          {/* Description */}
          <p className="detail-desc">
            {product.description || 'An exquisite piece crafted with unparalleled attention to detail. This luxury item represents the pinnacle of design and quality, perfect for those who appreciate the finer things in life.'}
          </p>

          {/* Size Selection */}
          <div className="mb-6">
            <h4 className="text-white mb-4">Select Size</h4>
            <div className="size-grid">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-12">
            <h4 className="text-white mb-4">Quantity</h4>
            <div className="quantity-controls">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="qty-btn"
              >
                <Minus size={20} strokeWidth={2.5} />
              </button>
              <span className="qty-display">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="qty-btn"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="detail-actions">
            <button
              onClick={handleAddToCart}
              className="btn-primary"
              style={{ flex: 1, padding: '1rem' }}
            >
              Add to Cart
            </button>
            <button className="qty-btn" style={{ width: '64px', height: 'auto', border: '1px solid var(--white)' }}>
              <Heart size={24} strokeWidth={2.5} />
            </button>
          </div>

          {/* Features */}
          <div className="detail-features">
            <div className="feature-row">
              <Truck size={24} strokeWidth={2.5} style={{ color: '#D4AF37' }} />
              <span>Free shipping worldwide</span>
            </div>
            <div className="feature-row">
              <Shield size={24} strokeWidth={2.5} style={{ color: '#D4AF37' }} />
              <span>Authenticity guaranteed</span>
            </div>
            <div className="feature-row">
              <RotateCcw size={24} strokeWidth={2.5} style={{ color: '#D4AF37' }} />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}