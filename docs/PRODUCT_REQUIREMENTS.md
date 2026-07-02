# Product Requirements Document: FreshMart Grocery

## 1. Overview
FreshMart is a modern, responsive MERN-stack grocery e-commerce application. It allows users to browse fresh produce, manage a cart, and place orders with real-time stock validation.

## 2. Core Features
- **Authentication**: User registration and login with JWT. Password visibility toggle.
- **Product Discovery**: 
  - Dynamic 5-column grid (responsive).
  - Search functionality.
  - Category filtering (Fruits, Vegetables, Dairy, etc.).
  - Sort by price and name.
- **Cart Management**: 
  - Add/Remove items.
  - Increment/Decrement quantity.
  - Real-time stock availability checks.
- **Checkout Flow**:
  - Address validation (Street, City, State, ZIP, Phone).
  - Multi-method payment selection.
  - Atomic stock deduction on order placement.
- **Admin Dashboard**:
  - Inventory management (Add/Edit/Delete products).
  - Order status tracking (Pending, Shipped, Delivered, etc.).
  - Low stock alerts.

## 3. Technical Stack
- **Frontend**: React, Vite, Tailwind CSS, React-Hot-Toast.
- **Backend**: Node.js, Express, MongoDB Atlas, Mongoose.
- **Security**: JWT, BcryptJS, Helmet.

## 4. Key User Flows for Testing
1. **Login**: Login with `admin@grocery.com` / `Admin@123Secure`.
2. **Shopping**: Browse products → Add "Apple" to cart → Increase qty to 5.
3. **Checkout**: Go to checkout → Enter address → Place order.
4. **Admin**: Go to dashboard → Update product price → Verify change on Home page.
