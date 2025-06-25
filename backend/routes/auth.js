const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateSignup, validateSignin } = require('../middlewares/authValidation');
const User = require('../models/User');

// Signup route
router.post('/signup', validateSignup, async (req, res) => {
    const { name, email, password } = req.validatedBody;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Signin route
router.post('/signin', validateSignin, async (req, res) => {
    const { email, password } = req.validatedBody;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '200m' }
        );
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email 
            } 
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;