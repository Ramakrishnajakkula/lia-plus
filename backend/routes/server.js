const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const expenseRoutes = require('./expenses');
const authMiddleware = require('../middlewares/authMiddleware');
app.use('/expenses', authMiddleware, expenseRoutes);

const authRoutes = require('./auth');
app.use('/auth', authRoutes);

// Serve React build in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

// Welcome message for testing
app.get("/", (req, res) => {
    res.json({
        message:"Welcome to the Expense Tracker API!"});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

