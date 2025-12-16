import { Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  product_images?: { url: string }[];
  category: string;
}

interface ProductCardProps {
  product: Product;
  onProductClick: (id: number) => void;
  variant?: 'default' | 'black';
}

export function ProductCard({ product, onProductClick, variant = 'default' }: ProductCardProps) {
  const displayImage = product.product_images?.[0]?.url || product.image || 'https://via.placeholder.com/500';

  return (
    <div
      onClick={() => onProductClick(product.id)}
      className={`product-card ${variant === 'black' ? 'card-black p-4' : ''}`}
    >
      {/* Image Container */}
      <div className="product-image-container">
        <ImageWithFallback
          src={displayImage}
          alt={product.name}
          className="product-image"
        />
        <button className="wishlist-btn">
          <Heart size={20} strokeWidth={2.5} className="text-[#D4AF37]" style={{ filter: 'drop-shadow(0 0 6px rgba(244, 224, 77, 0.5))' }} />
        </button>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          ${product.price.toLocaleString()}
        </div>
      </div>
    </div>
  );
}