# 🌱 Sri Amman Biocare (SAB) – Official Website & Admin Portal

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

A modern, full-stack, enterprise-grade web application built for **Sri Amman Biocare (SAB Research Centre)**, Thanjavur, Tamil Nadu. Established in 2007 by **Dr. R. Senthilkumar**, Sri Amman Biocare is a pioneer in organic biofertilizers, biocontrol agents, vermicompost, entrepreneurship training, agricultural internships, and academic research assistance.

---

## 🌟 Key Highlights & Features

### 👤 1. Public User Portal
- **Hero & Storytelling:** Engaging introduction to Dr. R. Senthilkumar and Sri Amman Biocare's legacy since 2007.
- **Dynamic Product Catalog:** Categorized browsing of Biofertilizers, Biocontrol Agents, Biopesticides, Vermicompost, Earthworms, and Azolla.
- **Dedicated Product Details Pages:** Dynamic routes (`/products/:id`) highlighting specifications, application dosage (e.g., Paddy Special 1000ml/acre), pricing, and benefits.
- **Academic & Training Services:**
  - **Entrepreneurship Training:** 9 specialized tracks (Biofertilizers, Biocontrol, Mushroom Cultivation, Vermicompost, Spirulina, Azolla, Beekeeping, Integrated Farming, Organic Farming).
  - **Internships & Field Visits:** Technical guidance for B.Sc., M.Sc., and Ph.D. research projects, mini-projects, and university department MoUs.
- **One-Click WhatsApp Integration:** Dynamic pre-filled WhatsApp enquiry messages (`+91 8248010800`, `+91 9865778873`) identifying the user's selected product or service.
- **Direct Enquiry System:** Instant database logging with real-time feedback for customer queries.
- **Fully Responsive Design:** Tailored layouts for smartphones, tablets, and high-resolution monitors with custom mobile navigation drawer.

### 🛡️ 2. Secure Admin Management Portal (`/sab-admin-portal`)
- **Discrete Route Security:** Unlisted URL designed strictly for authorized staff authentication.
- **Executive Analytics Dashboard:**
  - Real-time counters for Products, Categories, Customer Enquiries, and Pending Inquiries.
  - Recent activity feed and quick action panels.
- **Complete Product Management (CRUD):**
  - Add, edit, filter, search, and delete products.
  - Multi-attribute support: Application methods, dosage, pricing, benefits, and category association.
  - Local image upload with automatic fallback preview.
- **Dynamic Category Management:**
  - Create, view, update, and delete product categories.
  - Category-level banner image management.
- **Customer Enquiry Hub:**
  - View incoming enquiries with timestamps, contact info, and product references.
  - Update enquiry status (`New`, `Contacted`, `Resolved`).
  - Direct WhatsApp reply launcher from the admin interface.
- **Program & Event Showcase Management:**
  - Manage Institutional Visits, MoU agreements, and Resource Person sessions with photo gallery uploads.

---

## 🛠️ Technology Stack

- **Frontend:**
  - React 18
  - Vite (Fast HMR & Optimized Bundling)
  - Tailwind CSS & Lucide Icons
  - React Router DOM v6
  - Axios for HTTP clients
- **Backend:**
  - Node.js & Express.js
  - MongoDB Atlas via Mongoose
  - Multer (Local static file & media storage in `/uploads`)
  - CORS, Dotenv, and Express JSON middleware
  - Built-in resilience: In-memory fallback dataset for offline/sandbox testing

---

## 📁 Repository Structure

```
SAB-Website/
├── backend/
│   ├── config/             # Database connection & Atlas setup
│   ├── controllers/        # Route controllers (Product, Category, Enquiry, Program)
│   ├── middleware/         # Auth & Multer upload middleware
│   ├── models/             # Mongoose schemas (Product, Category, Enquiry, Program)
│   ├── routes/             # Express API routes
│   ├── uploads/            # Uploaded product and banner images
│   ├── .env.example        # Environment variable template
│   ├── package.json        # Backend dependencies
│   └── server.js           # Server entry point
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── assets/         # Images, banners, and institutional media
│   │   ├── components/     # Navbar, Footer, WhatsAppButton, ProtectedRoute
│   │   ├── pages/          # Home, Products, ProductDetail, About, Services, Contact, Admin
│   │   ├── App.jsx         # Main application routing
│   │   ├── index.css       # Tailwind directives & global styling
│   │   └── main.jsx        # React root mount
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json        # Frontend dependencies
├── .gitignore              # Git ignore rules for node_modules and .env
├── package.json            # Root orchestrator (concurrently)
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.x or later recommended)
- **npm** or **yarn**
- **MongoDB Atlas** account or local MongoDB instance

### 2. Clone the Repository
```bash
git clone https://github.com/sathyapriyakandhappan/SABwebsite.git
cd SABwebsite
```

### 3. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   npm install
   ```
2. Create your `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Set your MongoDB connection URI and configurations in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@sabdb.rio6amj.mongodb.net/sab?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

### 4. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   npm install
   ```

### 5. Running the Application
From the root directory, start both the backend server and frontend development server simultaneously:
```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173) (or 5174)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **Admin Portal:** [http://localhost:5173/sab-admin-portal](http://localhost:5173/sab-admin-portal)

---

## 📍 Organization Contact Information

**Sri Amman Biocare (SAB Research Centre)**
- **Proprietor:** Dr. R. Senthilkumar
- **Address:** 161, Pudukkottai Main Road, Thirukkanurpatti, Thanjavur – 613303, Tamil Nadu, India
- **Phone:** +91 82480 10800 / +91 98657 78873
- **Email:** [sabsenthil1@gmail.com](mailto:sabsenthil1@gmail.com)
- **YouTube:** [@sriammanbiocare3348](https://youtube.com/@sriammanbiocare3348?si=ZbRGwpN8QAxrovus)

---

## 📄 License
This project is proprietary and developed for **Sri Amman Biocare**. All rights reserved.
