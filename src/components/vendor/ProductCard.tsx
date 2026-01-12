import { Edit, Trash2, Eye } from 'lucide-react';
import { Product, ProductImage } from '../../types/vendor';

interface ProductCardProps {
    product: Product & { product_images?: ProductImage[] };
    onEdit: (productId: string) => void;
    onDelete: (productId: string) => void;
    onView: (productId: string) => void;
}

export function ProductCard({ product, onEdit, onDelete, onView }: ProductCardProps) {
    const primaryImage = product.product_images?.[0];
    const hasImage = primaryImage?.url;

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image */}
            <div className="aspect-square bg-gray-100 relative">
                {hasImage ? (
                    <img
                        src={primaryImage.url}
                        alt={primaryImage.alt_text || product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                    {product.published ? (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                            Published
                        </span>
                    ) : (
                        <span className="px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded">
                            Draft
                        </span>
                    )}
                </div>

                {/* Stock Badge */}
                {product.stock === 0 && (
                    <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                </h3>

                {product.sku && (
                    <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>
                )}

                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-[#D4AF37]">
                        ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>

                {product.short_description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.short_description}
                    </p>
                )}

                {/* Stats */}
                <div className="flex gap-4 text-xs text-gray-500 mb-4 pb-4 border-b">
                    <div>
                        <span className="font-medium text-gray-700">{product.view_count}</span> views
                    </div>
                    {product.brand && (
                        <div className="truncate">
                            Brand: <span className="font-medium text-gray-700">{product.brand}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onView(product.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                        <Eye size={16} />
                        View
                    </button>
                    <button
                        onClick={() => onEdit(product.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-white bg-[#D4AF37] hover:bg-[#B8941F] rounded-lg transition"
                    >
                        <Edit size={16} />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(product.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        aria-label="Delete product"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
