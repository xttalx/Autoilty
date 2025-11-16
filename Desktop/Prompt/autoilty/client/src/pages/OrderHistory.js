import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const OrderHistory = () => {
  const { user, supabase } = useAuth();
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);

      // Fetch order items for each order
      if (data && data.length > 0) {
        const orderIds = data.map((order) => order.id);
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            products (
              id,
              title,
              images,
              category
            )
          `)
          .in('order_id', orderIds);

        if (itemsError) throw itemsError;

        // Group items by order_id
        const itemsByOrder = {};
        itemsData.forEach((item) => {
          if (!itemsByOrder[item.order_id]) {
            itemsByOrder[item.order_id] = [];
          }
          itemsByOrder[item.order_id].push(item);
        });

        setOrderItems(itemsByOrder);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 pt-24">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 pt-24">
      <h1 className="text-4xl font-bold mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <Link
            to="/marketplace"
            className="bg-primary text-white px-6 py-3 rounded hover:bg-primary-dark transition inline-block"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {formatDate(order.created_at)}
                    </p>
                    {order.shipping_address && (
                      <p className="text-gray-600 text-sm mt-1">
                        {order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {orderItems[order.id]?.length || 0} item(s)
                    </p>
                  </div>
                </div>
              </div>

              {expandedOrder === order.id && orderItems[order.id] && (
                <div className="border-t bg-gray-50 p-6">
                  <h4 className="font-bold mb-4">Order Items</h4>
                  <div className="space-y-3">
                    {orderItems[order.id].map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-white p-4 rounded"
                      >
                        {item.products?.images?.[0] && (
                          <img
                            src={item.products.images[0]}
                            alt={item.products.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-grow">
                          <Link
                            to={`/product/${item.product_id}`}
                            className="font-semibold hover:text-primary transition"
                          >
                            {item.products?.title || 'Product'}
                          </Link>
                          <p className="text-sm text-gray-600">
                            Category: {item.products?.category || 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${parseFloat(item.price).toFixed(2)} × {item.quantity}
                          </p>
                          <p className="text-primary font-bold">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

