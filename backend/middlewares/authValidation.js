const { z } = require('zod');

const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

const signinSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required")
});

function validateSignup(req, res, next) {
    try {
        req.validatedBody = signupSchema.parse(req.body);
        next();
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({ message: err.errors[0].message });
        }
        res.status(400).json({ message: err.message });
    }
}

function validateSignin(req, res, next) {
    try {
        req.validatedBody = signinSchema.parse(req.body);
        next();
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({ message: err.errors[0].message });
        }
        res.status(400).json({ message: err.message });
    }
}

module.exports = { validateSignup, validateSignin };
