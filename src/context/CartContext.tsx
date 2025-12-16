import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CartItem {
<<<<<<< HEAD
    id: number | string; // Supabase uses UUID/number
    name: string;
    price: number;
    image: string;
    quantity: number;
    category: string;
    product_id: string; // Foreign key
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: any, quantity: number) => Promise<void>;
    updateQuantity: (itemId: number | string, quantity: number) => Promise<void>;
    removeItem: (itemId: number | string) => Promise<void>;
=======
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
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
    loading: boolean;
}

const CartContext = createContext<CartContextType>({
<<<<<<< HEAD
    cartItems: [],
    addToCart: async () => { },
    updateQuantity: async () => { },
    removeItem: async () => { },
    loading: false,
=======
    items: [],
    addToCart: async () => { },
    removeFromCart: async () => { },
    updateQuantity: async () => { },
    total: 0,
    itemCount: 0,
    loading: false
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
<<<<<<< HEAD
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [cartId, setCartId] = useState<string | null>(null);

    // Fetch Cart
    useEffect(() => {
        if (!user) {
            setCartItems([]);
            return;
        }

        const fetchCart = async () => {
            setLoading(true);
            try {
                // 1. Get or Create Cart
                let { data: cartData } = await supabase
                    .from('carts')
                    .select('id')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (!cartData) {
                    const { data: newCart, error: createError } = await supabase
                        .from('carts')
                        .insert({ user_id: user.id })
                        .select()
                        .single();
                    if (createError) throw createError;
                    cartData = newCart;
                }

                if (cartData) {
                    setCartId(cartData.id);

                    // 2. Fetch Items
                    const { data: items, error: itemsError } = await supabase
                        .from('cart_items')
                        .select(`
              *,
              products (
                name,
                price,
                description,
                product_images ( url )
              )
            `)
                        .eq('cart_id', cartData.id);

                    if (itemsError) throw itemsError;

                    // Transform to CartItem shape
                    // Note: This transformation depends on how your join returns data.
                    // Assuming 'products' is an object.
                    const formattedItems = items.map((item: any) => ({
                        id: item.id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price_at_time, // Or fetch fresh price
                        name: item.products?.name || 'Unknown Product',
                        // Image might be complex depending on your product_images table structure
                        image: item.products?.product_images?.[0]?.url || '',
                        category: 'Unknown' // Ideally fetch category too
                    }));

                    setCartItems(formattedItems);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [user]);

    const addToCart = async (product: any, quantity: number) => {
        if (!user || !cartId) {
            alert('Please login to add items to cart.');
=======
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
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
            return;
        }

        try {
<<<<<<< HEAD
            // Check if item exists in cart
            const existing = cartItems.find(item => item.product_id === product.id);

            if (existing) {
                await updateQuantity(existing.id, existing.quantity + quantity);
            } else {
                const { error } = await supabase.from('cart_items').insert({
=======
            const existing = items.find(i => i.product_id === product.id);
            if (existing) {
                await updateQuantity(existing.id, existing.quantity + quantity);
            } else {
                await supabase.from('cart_items').insert({
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
                    cart_id: cartId,
                    product_id: product.id,
                    quantity,
                    price_at_time: product.price
                });
<<<<<<< HEAD
                if (error) throw error;

                // Optimistic update or refetch
                // For simplicity, let's just append locally to avoid a round trip lag
                setCartItems(prev => [...prev, {
                    id: 'temp-' + Date.now(), // Will be fixed on refresh
                    product_id: product.id,
                    quantity,
                    price: product.price,
                    name: product.name,
                    image: product.image,
                    category: product.category
                }]);
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
        }
    };

    const updateQuantity = async (itemId: number | string, quantity: number) => {
        // If it's a temp ID, we might have issues, but assuming standard flow:
        if (typeof itemId === 'string' && itemId.startsWith('temp-')) return;

        try {
            const { error } = await supabase
                .from('cart_items')
                .update({ quantity })
                .eq('id', itemId);

            if (error) throw error;

            setCartItems(prev => prev.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            ));
        } catch (err) {
            console.error('Error updating quantity:', err);
        }
    };

    const removeItem = async (itemId: number | string) => {
        if (typeof itemId === 'string' && itemId.startsWith('temp-')) return;

        try {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', itemId);

            if (error) throw error;
            setCartItems(prev => prev.filter(item => item.id !== itemId));
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, loading }}>
=======
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
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
