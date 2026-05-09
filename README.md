# Subscription Manager

Subscription Manager is a fullstack web application for tracking paid subscriptions, viewing monthly and yearly spending, checking upcoming renewals, and finding potential savings from unused subscriptions.

## Features

- User registration and login with JWT authentication
- Password hashing with bcryptjs
- Protected subscription pages and API routes
- Create, read, update, and delete subscriptions
- Filter subscriptions by category, billing cycle, and used/unused status
- Sort subscriptions by price or next billing date
- Pagination on the subscriptions page
- Dashboard insights for monthly cost, yearly cost, top category, upcoming renewals, unused subscriptions, and potential savings
- Summary showing monthly and yearly cost after possible savings
- Loading, error, and empty states in the frontend

## Tech Stack

Frontend:

- React
- Vite
- React Router
- Axios
- Plain CSS

Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- cors

## Project Structure

```txt
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    app.js
    server.js

frontend/
  src/
    api/
    components/
    pages/
    routes/
    utils/
    App.jsx
    main.jsx
```

## Database Models

User:

```js
{
  name: String,
  email: String,
  password: String
}
```

Subscription:

```js
{
  userId: ObjectId,
  name: String,
  price: Number,
  billingCycle: "monthly" | "yearly",
  category: String,
  nextBillingDate: Date,
  isUsed: Boolean
}
```

## API Endpoints

Auth:

```txt
POST /api/auth/register
POST /api/auth/login
```

Subscriptions:

```txt
GET    /api/subscriptions
POST   /api/subscriptions
PUT    /api/subscriptions/:id
DELETE /api/subscriptions/:id
GET    /api/subscriptions/insights
```

Query examples:

```txt
GET /api/subscriptions?page=1&limit=5
GET /api/subscriptions?category=Entertainment
GET /api/subscriptions?billingCycle=monthly
GET /api/subscriptions?isUsed=false
GET /api/subscriptions?sortBy=price&order=desc
```

Protected subscription endpoints require:

```txt
Authorization: Bearer <token>
```

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Run Locally

Install backend dependencies:

```bash
cd backend
npm install
```

Start backend:

```bash
npm run dev
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start frontend:

```bash
npm run dev
```

Local URLs:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:5000/api
```

## Deployment

```txt
Deployed link: https://subscriptionmanager.xyz
```
