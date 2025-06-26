const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Your Vite dev server
    'https://lia-plus-vc2a.vercel.app', // Your production frontend
    // Add other domains as needed
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Routes
const expenseRoutes = require('./routes/expenses');
const authMiddleware = require('./middlewares/authMiddleware');
app.use('/expenses', authMiddleware, expenseRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Root and test routes
app.get("/", (req, res) => {
    res.send("Welcome to the Expense Tracker API!");
});

app.get("/testroute", (req, res) => {
    res.json({ message: "Test route is working!" });
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});