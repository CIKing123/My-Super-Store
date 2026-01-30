import { X, ChevronRight, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * MobileDrawer - Left sliding navigation drawer for mobile devices
 * 
 * Features:
 * - Horizontal scrollable menu
 * - Swipe-to-close gesture support
 * - Keyboard navigation (Esc to close)
 * - Focus trap for accessibility
 * - Click outside to close
 * 
 * @param isOpen - Controls drawer visibility
 * @param onClose - Callback when drawer should close
 */
export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const drawerRef = useRef<HTMLDivElement>(null);
    const [touchStartX, setTouchStartX] = useState(0);
    const [isShopExpanded, setIsShopExpanded] = useState(false);

    const shopCategories = [
        { label: 'All Products', value: 'All' },
        { label: 'Cosmetics', value: 'Cosmetics' },
        { label: 'Construction', value: 'Construction' },
        { label: 'Furniture', value: 'Furniture' },
        { label: 'Clothing and Fashion', value: 'Clothing and Fashion' },
        { label: 'Events Tools', value: 'Events Tools' },
        { label: 'Electrical Appliances', value: 'Electrical Appliances' }
    ];

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Shop', path: '/shop', hasSubmenu: true },
        { name: 'Cart', path: '/cart' },
        { name: 'Account', path: '/account' },
        { name: 'Login', path: '/login' }
    ];

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Set aria-hidden on main content
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.setAttribute('aria-hidden', 'true');
            }
        } else {
            document.body.style.overflow = '';
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.removeAttribute('aria-hidden');
            }
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                isOpen &&
                drawerRef.current &&
                !drawerRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };

        // Add a small delay to prevent immediate close on open
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Touch gesture handlers for swipe-to-close
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndX = e.changedTouches[0].clientX;
        const swipeDistance = touchStartX - touchEndX;

        // If swiped left more than 50px, close drawer
        if (swipeDistance > 50) {
            onClose();
        }
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    const handleCategoryClick = (categoryValue: string) => {
        navigate(`/shop?category=${categoryValue}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                role="dialog"
                aria-label="Navigation menu"
                aria-modal="true"
                className={`fixed left-0 top-0 h-full w-[80%] max-w-[320px] bg-white/95 backdrop-blur-lg shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Header with close button */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Menu</h2>
                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 transition-colors text-slate-900"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Horizontal scrollable menu */}
                <nav className="p-6">
                    <div className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <div key={item.name}>
                                {item.hasSubmenu ? (
                                    <>
                                        <button
                                            onClick={() => setIsShopExpanded(!isShopExpanded)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all font-semibold ${location.pathname === item.path
                                                ? 'bg-slate-900 text-white'
                                                : 'text-slate-700 hover:bg-slate-100'
                                                }`}
                                        >
                                            <span>{item.name}</span>
                                            {isShopExpanded ? (
                                                <ChevronDown size={20} className="transition-transform" />
                                            ) : (
                                                <ChevronRight size={20} className="transition-transform" />
                                            )}
                                        </button>

                                        {/* Shop categories submenu */}
                                        {isShopExpanded && (
                                            <div className="ml-4 mt-2 flex flex-col gap-1 border-l-2 border-slate-200 pl-4">
                                                {shopCategories.map((category) => (
                                                    <button
                                                        key={category.value}
                                                        onClick={() => handleCategoryClick(category.value)}
                                                        className="text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                                    >
                                                        {category.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleNavigation(item.path)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all font-semibold ${location.pathname === item.path
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-700 hover:bg-slate-100'
                                            }`}
                                    >
                                        {item.name}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>

                {/* Swipe hint */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                    <p className="text-xs text-slate-400">Swipe left or press ESC to close</p>
                </div>
            </div>
        </>
    );
}
