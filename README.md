FreshMart is a high-performance, full-stack grocery application built with the MERN stack. It features a modern "Glassmorphism" aesthetic, real-time stock management, and a robust admin dashboard.

FreshMart Banner

🚀 Repository & Demo
GitHub Repo: https://github.com/Mdsayeed098/freshmart
Live Demo: [https://freshmart-db6y.onrender.com/]
✨ Key Features
👤 User Experience
Modern UI/UX: Built with Tailwind CSS and "Outfit" typography for a premium feel.
Product Discovery: Advanced filtering by category, price range, and search.
Shopping Cart: Real-time updates, guest-cart support, and persistent state.
Secure Checkout: Validated shipping forms and simulated payment processing.
Order Tracking: Detailed order history and status updates.
🛡️ Security & Reliability
Firebase Authentication: Seamless Google OAuth & Email/Password login with email verification.
JWT Authentication: Secure API route protection synced with Firebase Admin SDK.
Stock Integrity: Atomic stock deduction to prevent overselling.
API Protection: Admin-only routes and middleware validation.
Production Ready: Configured with helmet, cors, and structured logging.
⚡ Performance & Optimization
WebP Image Format: Highly optimized product images for fast loading times and reduced bandwidth.
Smart Auth Fallback: Automatically attempts login if a user signs up with an existing account.
⚙️ Admin Dashboard
Inventory Control: Full CRUD operations for products.
Order Management: View and update order statuses in real-time.
Analytics: Overview of total sales, user count, and inventory health.
🛠️ Tech Stack
Frontend: React 19, Vite, Tailwind CSS, React Router 7.
Backend: Node.js, Express.js.
Database: MongoDB (Mongoose ODM).
Authentication: Firebase Auth & Firebase Admin SDK.
State Management: React Context API.
Testing: Vitest (Frontend), Jest + Supertest (Backend), Playwright (E2E).
📦 Project Structure
freshmart/
├── client/           # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI & Layout
│   │   ├── context/     # State Management
│   │   ├── pages/       # Page Components
│   │   └── services/    # API Interceptors
├── server/           # Backend (Express + Node)
│   ├── config/       # DB Connection
│   ├── controllers/  # Business Logic
│   ├── middleware/   # Auth & Error handling
│   ├── models/       # MongoDB Schemas
│   └── routes/       # API Endpoints
└── tests/            # E2E Playwright Tests
🔧 Installation & Setup
1. Clone the repository
git clone https://github.com/Mdsayeed098/freshmart.git
cd freshmart
2. Backend Setup
cd server
npm install
# Create .env file based on .env.example and add your Firebase credentials
npm run seed  # Seed 50+ initial products
npm run dev
3. Frontend Setup
cd ../client
npm install
npm run dev
4. Running Tests
# Backend
cd server && npm test

# Frontend
cd client && npm test

# E2E
npx playwright test
📝 API Overview
Method	Endpoint	Description	Auth
POST	/api/auth/login	User login	Public
GET	/api/products	Get all products	Public
POST	/api/orders	Create an order	User
GET	/api/admin/orders	Get all orders	Admin


