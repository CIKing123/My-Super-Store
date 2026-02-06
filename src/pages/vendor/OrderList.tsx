import { useState, useEffect } from 'react';
import { Loader2, Package, Clock, CheckCircle, XCircle, Copy, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useVendor } from '../../hooks/useVendor';
import { OrderWithDetails } from '../../types/vendor';

export function OrderList() {
    const { vendor, loading: vendorLoading } = useVendor();
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

    useEffect(() => {
        if (vendor) {
            fetchOrders();
        }
    }, [vendor, filterStatus]);

    const fetchOrders = async () => {
        if (!vendor) return;

        try {
            setLoading(true);

            // Query order_items filtered by vendor_id, only for paid orders
            let query = supabase
                .from('order_items')
                .select(`
                    *,
                    products(
                        id, 
                        name, 
                        price,
                        sku,
                        product_images ( url, position )
                    ),
                    orders!inner(
                        id,
                        status,
                        total_amount,
                        currency,
                        placed_at,
                        updated_at,
                        user_id,
                        shipping_address_id,
                        shipping_address:addresses(*)
                    )
                `)
                .eq('vendor_id', vendor.id)
                .eq('orders.status', 'paid')
                .order('created_at', { ascending: false });

            const { data, error } = await query;

            if (error) throw error;

            // Get unique order IDs to fetch payments
            const orderIds = [...new Set(data?.map((item: any) => item.orders.id) || [])];

            // Fetch payments for all orders
            const { data: paymentsData, error: paymentsError } = await supabase
                .from('payments')
                .select('*')
                .in('order_id', orderIds);

            if (paymentsError) {
                console.error('Error fetching payments:', paymentsError);
            }

            // Group order items by order_id and attach payments
            const ordersMap = new Map<string, OrderWithDetails>();

            data?.forEach((item: any) => {
                const orderId = item.orders.id;

                if (!ordersMap.has(orderId)) {
                    ordersMap.set(orderId, {
                        ...item.orders,
                        order_items: [],
                        payments: paymentsData?.filter(p => p.order_id === orderId) || [],
                    });
                }

                const order = ordersMap.get(orderId)!;
                order.order_items = order.order_items || [];
                order.order_items.push({
                    ...item,
                    products: item.products,
                });
            });

            let ordersList = Array.from(ordersMap.values());

            // Apply status filter if needed (though we only fetch paid orders)
            if (filterStatus !== 'all' && filterStatus !== 'paid') {
                ordersList = ordersList.filter((order) => order.status === filterStatus);
            }

            setOrders(ordersList);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    if (vendorLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin text-[#D4AF37]" size={48} />
            </div>
        );
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="text-yellow-600" size={20} />;
            case 'completed':
                return <CheckCircle className="text-green-600" size={20} />;
            case 'shipped':
                return <Package className="text-blue-600" size={20} />;
            case 'cancelled':
                return <XCircle className="text-red-600" size={20} />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const copyShippingAddress = async (address: any, orderId: string) => {
        if (!address) return;

        const formattedAddress = `${address.line1 || ''}${address.line2 ? '\n' + address.line2 : ''}\n${address.city || ''}, ${address.state || ''} ${address.postal_code || ''}\n${address.country || ''}`;

        try {
            await navigator.clipboard.writeText(formattedAddress);
            setCopiedOrderId(orderId);
            setTimeout(() => setCopiedOrderId(null), 2000);
        } catch (err) {
            console.error('Failed to copy address:', err);
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'success':
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
                <p className="text-gray-600">
                    Manage orders containing your products
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex gap-2 overflow-x-auto">
                    {['all', 'pending', 'shipped', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${filterStatus === status
                                ? 'bg-[#D4AF37] text-black'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Orders Found
                    </h3>
                    <p className="text-gray-600">
                        {filterStatus === 'all'
                            ? 'No orders containing your products yet'
                            : `No ${filterStatus} orders`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            {/* Order Header */}
                            <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Order #{order.id.slice(0, 8)}
                                        </h3>
                                        <span
                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {getStatusIcon(order.status)}
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Placed on {new Date(order.placed_at).toLocaleDateString()} at{' '}
                                        {new Date(order.placed_at).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-[#D4AF37]">
                                        ${order.total_amount.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600">{order.currency}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3 mb-4">
                                <h4 className="font-medium text-gray-900">Your Products in this Order:</h4>
                                {order.order_items?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 py-2 px-3 bg-gray-50 rounded-lg"
                                    >
                                        {/* Product Image */}
                                        {item.products?.product_images?.[0]?.url ? (
                                            <img
                                                src={item.products.product_images[0].url}
                                                alt={item.products.name || 'Product'}
                                                className="w-16 h-16 object-cover rounded flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                                                <Package className="text-gray-400" size={24} />
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {item.products?.name || 'Unknown Product'}
                                            </p>
                                            {item.products?.sku && (
                                                <p className="text-xs text-gray-500">
                                                    SKU: {item.products.sku}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity} × ${item.unit_price.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            ${(item.quantity * item.unit_price).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Payment Information */}
                            {order.payments && order.payments.length > 0 && (
                                <div className="pt-4 border-t border-gray-200 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard className="text-gray-600" size={18} />
                                        <h4 className="font-medium text-gray-900">Payment Information</h4>
                                    </div>
                                    {order.payments.map((payment) => (
                                        <div key={payment.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Provider</span>
                                                <span className="text-sm font-medium text-gray-900 capitalize">
                                                    {payment.provider}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Status</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                                                    {payment.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Amount</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {payment.currency} {payment.amount.toFixed(2)}
                                                </span>
                                            </div>
                                            {payment.provider_payment_id && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Transaction ID</span>
                                                    <span className="text-xs font-mono text-gray-700">
                                                        {payment.provider_payment_id.slice(0, 20)}...
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Shipping Address */}
                            {order.shipping_address && (
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">Shipping Address</h4>
                                        <button
                                            onClick={() => copyShippingAddress(order.shipping_address, order.id)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            <Copy size={14} />
                                            {copiedOrderId === order.id ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <p className="text-gray-900">{order.shipping_address.line1}</p>
                                        {order.shipping_address.line2 && (
                                            <p className="text-gray-900">{order.shipping_address.line2}</p>
                                        )}
                                        <p className="text-gray-900">
                                            {order.shipping_address.city}, {order.shipping_address.state}{' '}
                                            {order.shipping_address.postal_code}
                                        </p>
                                        <p className="text-gray-900">{order.shipping_address.country}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
