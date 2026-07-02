import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { describe, it, expect, vi } from 'vitest';

// Simple mock for the cart context if needed, but here we wrap with real provider for simplicity
describe('ProductCard Component', () => {
  const mockProduct = {
    _id: '123',
    name: 'Fresh Organic Apples',
    price: 4.99,
    unit: 'kg',
    image: 'https://example.com/apple.jpg',
    isAvailable: true,
    category: 'Fruits'
  };

  it('renders product name and price correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ProductCard product={mockProduct} />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Fresh Organic Apples')).toBeInTheDocument();
    expect(screen.getByText('$4.99')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
  });

  it('shows ADD button when quantity is zero', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ProductCard product={mockProduct} />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /ADD/i })).toBeInTheDocument();
  });
});
