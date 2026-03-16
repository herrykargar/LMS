# 🎨 Leanify Frontend (Client)

This repository contains the **React-based frontend client** for **Leanify**, a comprehensive E-Learning SaaS platform.

The frontend is a fast, responsive Single Page Application (SPA) built to deliver an exceptional user experience using modern web technologies and premium design principles.

## 🚀 Key Features

*   **🎓 Role-Based Dashboards:** Distinct and personalized interfaces for Students, Faculty (Instructors), and Administrators.
*   **📚 Intuitive Course Catalog:** A dynamic grid displaying available courses with seamless filtering and search capabilities.
*   **🛠️ Immersive Learning Hub:** A distraction-free video player and PDF viewer accompanied by an interactive lesson sidebar.
*   **💳 Simulated UPI Checkout:** A cutting-edge fake payment gateway generating dynamic UPI QR codes, simulating a seamless checkout process without monetary overhead.
*   **💬 Interactive Forums:** Dedicated discussion threads for every course, fostering peer-to-peer and instructor-student engagement.
*   **📝 Assessment Engine:** Integrated quiz system with strict timing and instant automated scoring.
*   **✨ Premium Glassmorphism UI:** Built extensively with Tailwind CSS, featuring aesthetic blur effects, vibrant gradients, and fully responsive layouts that adapt beautifully across all devices.

## 🛠️ Technology Stack

*   **Framework:** [React.js](https://react.dev/) powered by [Vite](https://vitejs.dev/) for blazing fast Hot Module Replacement (HMR) and optimized builds.
*   **Styling:** [Tailwind CSS (v4)](https://tailwindcss.com/) for utility-first, highly customizable design.
*   **Routing:** [React Router DOM](https://reactrouter.com/) for seamless SPA navigation.
*   **HTTP Client:** [Axios](https://axios-http.com/) for asynchronous API requests to the Leanify backend.
*   **QR Integration:** `qrcode.react` for dynamic UPI string generation and rendering.

## ⚙️ Getting Started

### Prerequisites

*   Node.js (v18.x or higher)
*   NPM or Yarn package manager
*   A running instance of the **Leanify Backend API Server** (refer to the root project documentation).

### Installation

1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the `client` directory to link the frontend with your local backend API.
    ```env
    VITE_API_BASE_URL=http://localhost:5050/api
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically be hot-reloaded and accessible at `http://localhost:5173`.

## 📁 Folder Structure

```
client/
├── public/           # Static assets (images, icons, etc.)
├── src/
│   ├── assets/       # Project-specific assets like logos
│   ├── components/   # Reusable UI components (Buttons, Inputs, Modals)
│   ├── pages/        # Route components (Home, Dashboard, CourseDetail, Checkout)
│   ├── context/      # React Context API providers for global state management (Auth, etc.)
│   ├── services/     # Axios API call modules handling backend endpoints
│   ├── utils/        # Helper functions and overarching constants
│   ├── App.jsx       # Main application layout and routing setup
│   └── main.jsx      # React DOM rendering entry point
├── index.html        # Main HTML template
├── tailwind.config.js# Tailwind CSS configuration and theme extensions
└── vite.config.js    # Vite bundler configuration
```

## 📖 Complete Documentation
For an in-depth dive into the System Architecture, Data Flow Diagrams, Database Schema (ER), API Endpoints, and full product details, please refer to the `Leanify_Project_Documentation.md` file located at the project's root directory.

---
*Created by HERRY & TEAM.*
