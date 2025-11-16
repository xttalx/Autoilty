import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminPanel = () => {
  const { user: authUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      let query = supabase.from('products').select('*');

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateProductStatus = async (productId, status) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status })
        .eq('id', productId);

      if (error) throw error;

      toast.success(`Product ${status}`);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
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
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="flex space-x-4">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded transition ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} (
              {status === 'all'
                ? products.length
                : products.filter((p) => p.status === status).length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No products found.</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6"
            >
              <div className="w-full md:w-48 h-48 bg-gray-200 rounded flex-shrink-0">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <strong>Price:</strong> ${product.price.toFixed(2)}
                  </div>
                  <div>
                    <strong>Category:</strong> {product.category}
                  </div>
                  <div>
                    <strong>Vendor:</strong> {product.vendor_name || 'Unknown'}
                  </div>
                  <div>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`px-2 py-1 rounded ${
                        product.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateProductStatus(product.id, 'approved')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateProductStatus(product.id, 'rejected')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {product.status === 'approved' && (
                    <button
                      onClick={() => updateProductStatus(product.id, 'pending')}
                      className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                    >
                      Unapprove
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

