# Live Demo

Access the live application here: [https://lia-plus-go.vercel.app/](https://lia-plus-go.vercel.app/)

Experience the deployed frontend (on Vercel) connected to the backend (on Render).

---

# Expense Tracker – Lia Plus SDE Assignment

Welcome to the Expense Tracker!  
This is a full-stack, production-ready MERN application built as part of the Lia Plus SDE assignment.  
It demonstrates clean architecture, secure authentication, real-time UI, and a modern developer experience.

---

## 🚀 Features

- **User Authentication:** Secure JWT-based sign up & sign in.
- **Personalized Data:** Each user sees and manages only their own income and expenses.
- **Income & Expense Tracking:** Add, edit, delete, and categorize both income and expenses.
- **Interactive Dashboard:** Real-time charts, category breakdowns, and summaries.
- **Responsive UI:** Beautiful, mobile-friendly design with Tailwind CSS.
- **RESTful API:** Clean, well-documented endpoints.
- **Production-Ready:** Easily deployable on Vercel (frontend & backend separated).

---

## 🏗️ Architecture

- **Frontend:** React (Vite) + Tailwind CSS
  - Component-based, responsive, and interactive.
  - Uses Axios for API calls, JWT for auth, and Chart.js for visualization.
- **Backend:** Node.js + Express.js
  - RESTful API, JWT authentication, Zod validation.
  - Mongoose models for User and Expense.
- **Database:** MongoDB (Atlas or local)
- **Deployment:** Vercel (separate projects for frontend and backend)

**Data Flow:**

```
[React UI] ⇄ [Express API] ⇄ [MongoDB]
      |           |
      |        JWT Auth
      |           |
      +---[Vercel Deployment]---+
```

---

## ⚡ Quick Start

### 1. Clone the Repo

```bash
git clone https://github.com/Ramakrishnajakkula/lia-plus.git
cd lia-plus
```

### 2. Backend Setup

```bash
cd backend
npm install
# Create .env with:
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
npm start
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
# Create .env with:
# VITE_API_URL=http://localhost:5000
npm run dev
```

### 4. Open in Browser

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## 🌐 Deployment (Vercel)

- Deploy `frontend` and `backend` folders as **separate projects** on Vercel.
- Set environment variables in Vercel dashboard for each project.
- In frontend `.env`, set `VITE_API_URL` to your deployed backend URL.

---

## 🔑 API Endpoints

### Auth

- `POST /auth/signup` – Register a new user  
  **Body:** `{ name, email, password, confirmPassword }`
- `POST /auth/signin` – Login and receive JWT  
  **Body:** `{ email, password }`  
  **Response:** `{ token, user }`

### Expenses (Protected: `Authorization: Bearer <token>`)

- `GET /expenses` – Get all income/expenses for the user
- `POST /expenses` – Add new  
  **Body:** `{ amount, category, description, date, type }` (`type`: `"income"` or `"expense"`)
- `PUT /expenses/:id` – Update by ID
- `DELETE /expenses/:id` – Delete by ID

---

## 🧩 Folder Structure

```
task/
  backend/
    models/         # User, Expense schemas
    routes/         # auth.js, expenses.js
    middlewares/    # JWT auth
    server.js
    vercel.json
  frontend/
    src/
      pages/        # Dashboard, Expenses, AddExpense, etc.
      components/   # Navbar, etc.
      App.jsx
      index.css
    package.json
    vite.config.js
    vercel.json
  README.md
```

---

## 🎨 UI/UX Highlights

- **Dashboard:** Real-time summary cards, interactive filters (weekly, monthly, yearly, custom), and category-wise charts.
- **Add/Edit:** Modern, accessible forms for both income and expenses.
- **Expense Table:** Clean, color-coded, and mobile-friendly.
- **Authentication:** Friendly error messages and clear navigation.

---

## 💡 Why This Implementation Stands Out

- **Security:** JWT, password hashing, and per-user data isolation.
- **Scalability:** Modular code, clear separation of concerns, and stateless API.
- **Developer Experience:** Type-safe validation (Zod), clear error handling, and easy environment configuration.
- **Production-Ready:** Vercel deployment, environment variable support, and CI-friendly scripts.

---

## 📚 Example .env Files

**backend/.env**

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

**frontend/.env**

```
VITE_API_URL=https://your-backend-url.vercel.app
```

---

## 🙌 Assignment Notes

- **All code is original and well-commented.**
- **Tested for edge cases and real-world usage.**
- **Ready for demo and further extension (multi-user, analytics, etc).**

---

# Project Setup & Installation

## Live Deployment

- **Frontend:** Deployed on [Vercel](https://vercel.com/)
- **Backend:** Deployed on [Render](https://render.com/)

## Getting Started (Local Development)

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd <project-directory>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   - Update the `.env` file as needed.
   - For local development, point the frontend to the Render backend API URL.

4. **Run the frontend locally**
   ```bash
   npm start
   ```

## Usage

- Access the live frontend at: [Vercel Deployment URL]
- The frontend communicates with the backend hosted on Render.

## Notes

- No need to run the backend locally unless you want to develop or debug backend features.
- Update API endpoints in the frontend to use the Render backend URL for production.

---

**Thank you for reviewing this assignment!**  
_Built with ❤️ for Lia Plus SDE role._
