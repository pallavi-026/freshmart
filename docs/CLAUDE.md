# Grocery Selling Application

## Project Overview
A full-stack grocery selling application with user authentication, product browsing, shopping cart, order placement, and admin management.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS v3 + Axios + React Router DOM + Context API
- **Backend**: Node.js + Express.js + MongoDB + Mongoose + JWT + bcrypt
- **Dev Tools**: dotenv, cors, concurrently, ESLint

## Architecture Rules
- Follow **MVC architecture** on the backend
- Use **component-based architecture** on the frontend
- Use **async/await** everywhere — no raw callbacks
- Use **modular, reusable code** — no monolith files
- Maintain **clean API contracts** between frontend and backend
- Use **environment variables** for all secrets and config
- **Never hardcode** sensitive values (API keys, DB URIs, JWT secrets)

## File Ownership Rules
- **DO NOT** edit the same file from multiple teammates simultaneously
- Each teammate owns specific directories:
  - `architect`: documentation, schemas, API specs
  - `backend-dev`: everything under `server/`
  - `frontend-dev`: everything under `client/`
  - `integrator`: root config files, README, .env, integration tests
- If you need a file another teammate owns, **message them** instead of editing directly

## Code Standards
- Use descriptive variable and function names
- Add JSDoc comments on all controller functions
- All API responses must follow consistent format: `{ success, data, message }`
- All errors must be handled with proper status codes
- Forms must have client-side AND server-side validation
- All React components must be functional components with hooks
- Use proper loading states and error boundaries in the UI

## Database
- MongoDB with Mongoose ODM
- Models: User, Product, Cart, Order
- Use proper indexing on frequently queried fields
- Validate all input at the schema level

## API Design
- RESTful conventions
- Base URL: `/api`
- Auth routes: `/api/auth/*`
- Product routes: `/api/products/*`
- Cart routes: `/api/cart/*`
- Order routes: `/api/orders/*`
- Admin routes: `/api/admin/*`
- All protected routes require JWT Bearer token

## Frontend Design
- Dark mode with emerald green accent (grocery theme)
- Glassmorphism cards with subtle animations
- Mobile-first responsive design
- Toast notifications for user feedback
- Loading spinners/skeletons during API calls
- Empty state components (empty cart, no orders, etc.)

## Testing Requirements
- Test every API endpoint before marking complete
- Test full user flow: Register → Login → Browse → Add to Cart → Checkout → View Orders
- Test admin flow: Login as admin → Add Product → Edit → Delete → Manage Orders
- Verify responsive design on mobile viewport

## Deployment Targets
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Execution Order
1. Architecture planning & approval FIRST
2. Backend + Frontend development in PARALLEL (after API contracts approved)
3. Integration & testing LAST
4. Documentation & cleanup FINAL
