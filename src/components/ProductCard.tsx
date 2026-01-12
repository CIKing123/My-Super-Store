import { useEffect, useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
  brand?: string;
  sku?: string;
  short_description?: string;
  image?: string;
  product_images?: { url: string; alt_text?: string; position?: number }[];
  category: string;
}

interface ProductCardProps {
  product: Product;
  onProductClick: (id: number) => void;
  variant?: 'default' | 'black';
}

export function ProductCard({ product, onProductClick, variant = 'default' }: ProductCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const images = product.product_images?.map(img => img.url) || [product.image || 'https://via.placeholder.com/500'];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!isAutoRotating || images.length <= 1) return;

    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating, images.length]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoRotating(false);
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoRotating(false);
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleMouseEnter = () => setIsAutoRotating(false);
  const handleMouseLeave = () => setIsAutoRotating(true);

  const inStock = (product.stock ?? 0) > 0;

  return (
    <div
      onClick={() => onProductClick(product.id)}
      className={`product-card ${variant === 'black' ? 'card-black p-4' : ''}`}
    >
      {/* Image Container with Carousel */}
      <div
        className="product-image-container group relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main Image */}
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <ImageWithFallback
            src={images[imageIndex]}
            alt={product.name}
            className="product-image transition-opacity duration-500"
          />

          {/* Stock Badge */}
          {!inStock && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Out of Stock
            </div>
          )}

          {/* Brand Badge */}
          {product.brand && (
            <div className="absolute top-2 right-2 bg-black/60 text-[#D4AF37] px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
              {product.brand}
            </div>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 px-2 py-1 rounded-full text-xs text-[#D4AF37] backdrop-blur-sm">
              {imageIndex + 1} / {images.length}
            </div>
          )}

          {/* Navigation Arrows - visible on hover */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 hover:bg-[#D4AF37] text-white hover:text-black p-1.5 rounded-full backdrop-blur-sm"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 hover:bg-[#D4AF37] text-white hover:text-black p-1.5 rounded-full backdrop-blur-sm"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </>
          )}

          {/* Image Indicator Dots - visible on hover */}
          {images.length > 1 && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAutoRotating(false);
                    setImageIndex(index);
                  }}
                  className={`w-1 h-1 rounded-full transition-all ${index === imageIndex
                      ? 'bg-[#D4AF37] w-2'
                      : 'bg-white/40 hover:bg-white/60'
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className="wishlist-btn"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart size={20} strokeWidth={2.5} className="text-[#D4AF37]" style={{ filter: 'drop-shadow(0 0 6px rgba(244, 224, 77, 0.5))' }} />
        </button>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>

        {/* Short Description */}
        {product.short_description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {product.short_description}
          </p>
        )}

        {/* SKU and Stock Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          {product.sku && <span>SKU: {product.sku}</span>}
          {inStock && (
            <span className="flex items-center gap-1 text-green-600">
              <Package size={12} />
              {product.stock} in stock
            </span>
          )}
        </div>

        <div className="product-price">
          ${product.price.toLocaleString()}
        </div>
      </div>
    </div>
  );
}