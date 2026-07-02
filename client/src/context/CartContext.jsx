import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Guest cart from localStorage
  const getGuestCart = () => {
    try {
      return JSON.parse(localStorage.getItem('guestCart') || '{"items":[]}');
    } catch (e) {
      return { items: [] };
    }
  };
  const saveGuestCart = (c) => localStorage.setItem('guestCart', JSON.stringify(c));

  const fetchCart = async () => {
    if (!user) {
      setCart(getGuestCart());
      return;
    }
    try {
      setLoading(true);
      const { data } = await API.get('/cart');
      if (data.success) setCart(data.data);
    } catch (err) {
      console.warn('[CartContext] fetchCart error:', err?.message);
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  // Get quantity of a specific product in cart
  const getItemQty = (productId) => {
    if (!user) {
      const gc = getGuestCart();
      const item = gc.items.find(i => (i.product?._id || i.productId) === productId);
      return item ? item.quantity : 0;
    }
    const item = cart.items?.find(i => i.product?._id === productId);
    return item ? item.quantity : 0;
  };

  // Get cart item ID for a product
  const getItemId = (productId) => {
    const item = cart.items?.find(i => i.product?._id === productId);
    return item ? item._id : null;
  };

  const addToCart = async (productId, quantity = 1, productData = null) => {
    // 1. Optimistic Update
    const oldCart = { ...cart };
    if (!user) {
      // Guest cart - store locally
      const gc = getGuestCart();
      const existing = gc.items.find(i => i.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        gc.items.push({ productId, quantity, product: productData });
      }
      saveGuestCart(gc);
      setCart({ ...gc });
      return { success: true };
    }

    // Auth user optimistic update
    const existingIndex = cart.items.findIndex(i => i.product?._id === productId);
    let newItems = [...cart.items];
    if (existingIndex > -1) {
      newItems[existingIndex] = { 
        ...newItems[existingIndex], 
        quantity: newItems[existingIndex].quantity + quantity 
      };
    } else if (productData) {
      newItems.push({ product: productData, quantity, _id: 'temp-' + Date.now() });
    }
    setCart({ ...cart, items: newItems });

    // 2. Real Update
    try {
      const { data } = await API.post('/cart', { productId, quantity });
      if (data.success) setCart(data.data);
      return data;
    } catch (err) {
      setCart(oldCart); // Revert on failure
      throw err;
    }
  };

  const updateQuantity = async (itemId, quantity, productId = null) => {
    const oldCart = { ...cart };
    
    // 1. Optimistic Update
    let newItems = [...cart.items];
    const itemIndex = newItems.findIndex(i => i._id === itemId || (productId && i.product?._id === productId));
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        newItems.splice(itemIndex, 1);
      } else {
        newItems[itemIndex] = { ...newItems[itemIndex], quantity };
      }
      setCart({ ...cart, items: newItems });
    }

    if (!user) {
      const gc = { items: newItems };
      saveGuestCart(gc);
      return { success: true };
    }

    // 2. Real Update
    try {
      if (quantity <= 0) return removeItem(itemId);
      const { data } = await API.put(`/cart/${itemId}`, { quantity });
      if (data.success) setCart(data.data);
      return data;
    } catch (err) {
      setCart(oldCart); // Revert
      throw err;
    }
  };

  const removeItem = async (itemId) => {
    const oldCart = { ...cart };
    
    // 1. Optimistic Update
    const newItems = cart.items.filter(i => i._id !== itemId);
    setCart({ ...cart, items: newItems });

    if (!user) {
      saveGuestCart({ items: newItems });
      return { success: true };
    }

    // 2. Real Update
    try {
      const { data } = await API.delete(`/cart/${itemId}`);
      if (data.success) setCart(data.data);
      return data;
    } catch (err) {
      setCart(oldCart); // Revert
      throw err;
    }
  };

  const clearCart = async () => {
    const oldCart = { ...cart };
    setCart({ items: [] });

    if (!user) {
      localStorage.removeItem('guestCart');
      return;
    }
    try { 
      await API.delete('/cart'); 
    }
    catch (err) { 
      setCart(oldCart);
      throw err; 
    }
  };

  const cartCount = useMemo(() => cart.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0, [cart.items]);
  const cartTotal = useMemo(() => cart.items?.reduce(
    (sum, item) => sum + ((item.product?.price || 0) * (item.quantity || 0)), 0
  ) || 0, [cart.items]);

  const value = useMemo(() => ({
    cart, loading, cartCount, cartTotal,
    addToCart, updateQuantity, removeItem, clearCart, fetchCart,
    getItemQty, getItemId
  }), [cart, loading, cartCount, cartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
