import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const fetchProduct = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, supabase]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} item(s) to cart!`);
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

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16 pt-24">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-primary hover:underline"
      >
        ← Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow-md">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} ${idx + 2}`}
                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 text-xl mr-2">★★★★☆</span>
            <span className="text-gray-600">4.5/5</span>
          </div>
          <p className="text-3xl font-bold text-primary mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Category:</strong> {product.category}
            </p>
            {product.vendor_name && (
              <p className="text-sm text-gray-600">
                <strong>Vendor:</strong> {product.vendor_name}
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition font-semibold text-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

