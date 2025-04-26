# 📝 Blog Application - Local Setup

This guide walks you through setting up and running the **Blog Application** locally for development purposes.

---

## 🔧 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm or [Yarn](https://yarnpkg.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free Tier is sufficient)
- [Git](https://git-scm.com/)

---

## 📦 1. Backend Setup

### 🔁 Clone the Backend Repository

```bash
git clone https://github.com/AshishKushaj/blog_backend
cd blog_backend
```

### 📥 Install Dependencies

```bash
npm install
# or
yarn install
```

### 🔐 Create a `.env` File

In the `blog_backend` root directory, create a `.env` file with the following contents:

```env
MONGO_URI="your_mongodb_atlas_connection_string"
JWT_SECRET="your_jwt_secret_key"
```

- Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas URI.
- Replace `your_jwt_secret_key` with a strong, random string.
- **Important:** Ensure `.env` is added to `.gitignore`.

### ▶️ Start the Backend Server

```bash
npm run server
# or
yarn server
```

> The backend should run on **http://localhost:3000** (unless otherwise specified).

---

## 🎨 2. Frontend Setup

### 🔁 Clone the Frontend Repository

```bash
git clone https://github.com/AshishKushaj/blog_frontend
cd blog_frontend
```

### 📥 Install Dependencies

```bash
npm install
# or
yarn install
```

### 🔐 Create a `.env` File

In the `blog_frontend` root directory, create a `.env` file with the following content:

```env
VITE_BACKEND_URL=http://localhost:3000
```

- Make sure this matches your backend's running port.
- **Important:** Ensure `.env` is added to `.gitignore`.

### ▶️ Start the Frontend Server

```bash
npm run dev
# or
yarn dev
```

> The frontend will typically run on **http://localhost:5173**.

---

## 🚀 Running the Application

1. Start both **backend** and **frontend** servers in separate terminal windows.
2. Open your browser and go to: [http://localhost:5173](http://localhost:5173)
3. You should now see the blog application running locally!

---
