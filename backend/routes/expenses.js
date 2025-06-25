const router = require('express').Router();
const Expense = require('../models/Expense');
const { z } = require('zod');

// Zod schema for expense
const expenseSchema = z.object({
    amount: z.number().positive("Amount must be positive"),
    category: z.string().min(1, "Category is required"),
    description: z.string().min(1, "Description is required"),
    date: z.string().min(1, "Date is required"),
    type: z.enum(['income', 'expense'], { required_error: "Type is required" })
});

// Get all expenses for the authenticated user
router.get('/', async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }
    try {
        const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new expense for the authenticated user
router.post('/', async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }
    try {
        const parsed = expenseSchema.parse(req.body);
        const expense = new Expense({ ...parsed, user: req.userId });
        const newExpense = await expense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({ message: err.errors[0].message });
        }
        res.status(400).json({ message: err.message });
    }
});

// Update expense (only if it belongs to the user)
router.put('/:id', async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }
    try {
        const parsed = expenseSchema.parse(req.body);
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            parsed,
            { new: true }
        );
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(expense);
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({ message: err.errors[0].message });
        }
        res.status(400).json({ message: err.message });
    }
});

// Delete expense (only if it belongs to the user)
router.delete('/:id', async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;