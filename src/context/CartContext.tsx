import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CartItem {
    id: string;
    product_id: string;
    quantity: number;
    products: any;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, quantity?: number) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    total: number;
    itemCount: number;
    loading: boolean;
}

const CartContext = createContext<CartContextType>({
    items: [],
    addToCart: async () => { },
    removeFromCart: async () => { },
    updateQuantity: async () => { },
    total: 0,
    itemCount: 0,
    loading: false
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [cartId, setCartId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) fetchCart();
        else setItems([]);
    }, [user]);

    const fetchCart = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Get or create cart
            let { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).single();

            if (!cart) {
                const { data: newCart, error } = await supabase.from('carts').insert({ user_id: user.id }).select().single();
                if (error || !newCart) throw error;
                cart = newCart;
            }

            setCartId(cart.id);

            // Fetch items
            const { data: cartItems } = await supabase
                .from('cart_items')
                .select(`*, products ( id, name, price, description, product_images ( url ) )`)
                .eq('cart_id', cart.id);

            setItems(cartItems || []);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product: any, quantity = 1) => {
        if (!user || !cartId) {
            alert('Please login to add to cart');
            return;
        }

        try {
            const existing = items.find(i => i.product_id === product.id);
            if (existing) {
                await updateQuantity(existing.id, existing.quantity + quantity);
            } else {
                await supabase.from('cart_items').insert({
                    cart_id: cartId,
                    product_id: product.id,
                    quantity,
                    price_at_time: product.price
                });
                await fetchCart();
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = async (itemId: string) => {
        await supabase.from('cart_items').delete().eq('id', itemId);
        setItems(prev => prev.filter(i => i.id !== itemId));
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (quantity < 1) return;
        await supabase.from('cart_items').update({ quantity }).eq('id', itemId);
        setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
    };

    const total = items.reduce((sum, item) => sum + (item.products?.price || 0) * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, total, itemCount, loading }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
