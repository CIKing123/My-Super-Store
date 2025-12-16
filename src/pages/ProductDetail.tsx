import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Truck, Shield, RotateCcw, Star, Minus, Plus, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';

<<<<<<< HEAD
interface Product {
  id: any;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
=======
export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('One Size');

  const sizes = ['Small', 'Medium', 'Large', 'One Size'];

  useEffect(() => {
<<<<<<< HEAD
    if (id) fetchProduct(id);
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
                *,
                product_categories (
                    categories ( name )
                ),
                product_images ( url )
            `)
        .eq('id', productId)
=======
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images ( url, alt_text ),
          product_categories (
            categories ( name )
          )
        `)
        .eq('id', id)
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
        .single();

      if (error) throw error;

<<<<<<< HEAD
      if (data) {
        const cats = data.product_categories?.map((pc: any) => pc.categories?.name) || [];

        setProduct({
          id: data.id,
          name: data.name,
          price: data.price,
          description: data.description,
          image: data.product_images?.[0]?.url || '',
          category: cats[0] || 'Uncategorized'
        });
      }
    } catch (err) {
      console.error('Error fetching product:', err);
=======
      setProduct({
        ...data,
        image: data.product_images?.[0]?.url,
        category: data.product_categories?.[0]?.categories?.name || 'Uncategorized'
      });
    } catch (error) {
      console.error('Error fetching product:', error);
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert('Added to cart!'); // Ideally replace with a toast
=======
  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product, quantity);
      alert('Product added to cart');
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
    }
  };

  if (loading) {
    return (
<<<<<<< HEAD
      <div className="section min-h-[50vh] flex items-center justify-center">
=======
      <div className="section flex items-center justify-center min-h-[50vh]">
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
        <Loader2 className="animate-spin text-[var(--gold-primary)]" size={48} />
      </div>
    );
  }

  if (!product) {
<<<<<<< HEAD
    return (
      <div className="section min-h-[50vh] flex items-center justify-center">
        <h2 className="text-white">Product not found</h2>
      </div>
    );
=======
    return <div className="section text-center text-white">Product not found</div>;
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
  }

  return (
    <div className="section">
      <div className="detail-grid">
        {/* Product Images - Left Column on White */}
        <div>
          <div className="gallery-main">
            <ImageWithFallback
              src={product.image || 'https://via.placeholder.com/800'}
              alt={product.name}
              className="product-image"
            />
          </div>
          <div className="gallery-thumbnails">
            {product.product_images?.map((img: any, i: number) => (
              <div key={i} className="gallery-thumb">
                <ImageWithFallback
                  src={img.url}
                  alt={img.alt_text || product.name}
                  className="product-image"
                />
              </div>
            )) || (
                [1, 2, 3].map(i => (
                  <div key={i} className="gallery-thumb">
                    <div className="w-full h-full bg-gray-200" />
                  </div>
                ))
              )}
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
<<<<<<< HEAD
            ${product.price ? product.price.toLocaleString() : '0'}
=======
            ${product.price?.toLocaleString()}
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
          </span>

          {/* Description */}
          <p className="detail-desc">
            {product.description || 'An exquisite piece crafted with unparalleled attention to detail.'}
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