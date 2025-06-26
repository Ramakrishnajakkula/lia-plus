const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',        // Your Vite dev server
  'https://lia-plus-vc2a.vercel.app' ,
  'https://lia-plus-go.vercel.app/'// Your production frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
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