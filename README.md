Blog Application - Local Setup
Prerequisites
Node.js (LTS)

npm or Yarn

MongoDB Atlas account

Git

1. Backend Setup
Clone: git clone https://github.com/AshishKushaj/blog_backend

Install: npm install (or yarn install)

.env: Create a file named .env in the backend root with your MongoDB Atlas connection string (MONGO_URI) and JWT secret (JWT_SECRET).

Start: npm run server (or yarn server)

2. Frontend Setup
Clone: git clone https://github.com/AshishKushaj/blog_frontend

Install: npm install (or yarn install)

.env: Create a file named .env in the frontend root with VITE_BACKEND_URL=http://localhost:3000.

Start: npm run dev (or yarn dev)

Running
Run backend (npm run server).

Run frontend (npm run dev).

Open frontend URL (e.g., http://localhost:5173) in your browser.
