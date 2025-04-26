Blog Application - Local SetupThis document provides instructions on how to set up and run the blog application locally.PrerequisitesNode.js (LTS version recommended)npm or Yarn package managerMongoDB Atlas account (Free Tier is sufficient for local development)Git1. Backend SetupClone the Backend Repository:git clone https://github.com/AshishKushaj/blog_backend
cd blog_backend
Install Dependencies:npm install
# or
yarn install
Create a .env file:In the root of your backend directory (blog_backend), create a file named .env.Add the following environment variables, replacing the placeholder values:MONGO_URI="your_mongodb_atlas_connection_string"
JWT_SECRET="your_jwt_secret_key"
Replace "your_mongodb_atlas_connection_string" with the connection string from your MongoDB Atlas cluster. Remember to replace <username>, <password>, and <dbname> in the string.Replace "your_jwt_secret_key" with a strong, random string for JWT signing.Important: Ensure .env is added to your backend's .gitignore file.Start the Backend Server:npm run server
# or
yarn server
The backend server should start and connect to your MongoDB Atlas database. It will typically run on port 3000 (or the port defined in your server.js).2. Frontend SetupClone the Frontend Repository:git clone https://github.com/AshishKushaj/blog_frontend
cd blog_frontend
Install Dependencies:npm install
# or
yarn install
Create a .env file:In the root of your frontend directory (blog_frontend), create a file named .env.Add the following environment variable, pointing to your local backend URL:VITE_BACKEND_URL=http://localhost:3000
Ensure the port matches the one your backend is running on locally.Important: Ensure .env is added to your frontend's .gitignore file.Start the Frontend Development Server:npm run dev
# or
yarn dev
The frontend development server should start, typically on port 5173 (or another available port).Running the ApplicationEnsure both your backend (npm run server or yarn server) and frontend (npm run dev or yarn dev) servers are running in separate terminals.Open your web browser and navigate to the frontend development server's address (e.g., http://localhost:5173).You should now be able to use the application locally.
