# 📚 Leanify - A Comprehensive E-Learning SaaS Platform

Leanify is a robust, full-stack E-Learning SaaS platform built on the MERN stack. It bridges the structural gap between independent instructors, educational institutes, and eager learners by providing a unified environment for course creation, secure content delivery, student tracking, and community engagement.

## ✨ Key Features

*   **🎓 Role-Based Access Control:** Dedicated portals and tailored features for Students, Faculty (Instructors), and Administrators.
*   **🛠️ Course & Lesson Management:** Easy-to-use curriculum builder allowing video uploads, PDF notes, and dynamic progress tracking.
*   **💳 Simulated UPI Checkout:** A high-fidelity fake payment gateway generating dynamic QR codes to simulate the checkout process without monetary overhead. Perfect for testing and demonstrations.
*   **📝 Interactive Assessments:** Integrated quiz engine with strict timing, automated scoring, and real-time pass/fail evaluation.
*   **💬 Collaborative Forums:** Course-specific discussion boards enabling peer-to-peer and instructor-student communication.
*   **🎨 Premium Glassmorphism UI:** An immersive, highly responsive frontend developed with React and Tailwind CSS.

## 🏗️ Technology Stack

**Frontend:**
*   React.js with Vite
*   Tailwind CSS (v4)
*   React Router DOM
*   Axios

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose (NoSQL Database)
*   JWT for stateless Authentication
*   Bcrypt for password hashing
*   Multer for file processing

## 🚀 Getting Started

Follow these steps to run the Leanify application locally.

### Prerequisites
*   Node.js (v18.x or higher)
*   MongoDB (v5.0+ or a MongoDB Atlas Cloud connection URI)
*   NPM or Yarn

### 1. Database Setup
Ensure you have a local MongoDB server running or a cloud MongoDB Atlas URI ready.

### 2. Backend Server
Navigate to the server directory, install dependencies, and start the API:
```bash
cd server
npm install

# Create a .env file and add your MongoDB connection string and JWT Secret:
# MONGO_URI=mongodb://localhost:27017/leanify
# JWT_SECRET=your_super_secret_key
# PORT=5050

npm run dev
```
The API server will run at `http://localhost:5050`.

### 3. Frontend Client
Open a new terminal, navigate to the client directory, install dependencies, and run the development server:
```bash
cd client
npm install

# Create a .env file linking to your local backend:
# VITE_API_BASE_URL=http://localhost:5050/api

npm run dev
```
The React frontend will be available at `http://localhost:5173`.

## 📖 Complete Documentation
For an in-depth dive into the System Architecture, Data Flow Diagrams, Database Schema (ER), API Endpoints, and detailed module descriptions, please refer to the `Leanify_Project_Documentation.md` file included in this repository.

---
*Created by HERRY & TEAM.*
