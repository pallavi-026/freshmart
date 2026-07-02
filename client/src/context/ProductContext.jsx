import { createContext, useContext, useState, useMemo } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  /** Fetch the main product catalog (Products page) */
  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      const query = new URLSearchParams(params).toString();
      const { data } = await API.get(`/products?${query}`);
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.warn('[ProductContext] fetchProducts error:', err?.message);
      toast.error('Could not load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /** Fetch a small featured set for the Home page — does NOT touch `products` state */
  const fetchFeaturedProducts = async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await API.get(`/products?${query}`);
      if (data.success) {
        setFeaturedProducts(data.data);
      }
    } catch (err) {
      console.warn('[ProductContext] fetchFeaturedProducts error:', err?.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/products/categories/list');
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.warn('[ProductContext] fetchCategories error:', err?.message);
    }
  };

  const fetchProduct = async (id) => {
    try {
      const { data } = await API.get(`/products/${id}`);
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('[ProductContext] fetchProduct error:', err?.message);
      return null;
    }
  };

  const value = useMemo(() => ({
    products, featuredProducts, pagination, categories, loading,
    fetchProducts, fetchFeaturedProducts, fetchCategories, fetchProduct
  }), [products, featuredProducts, pagination, categories, loading]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
