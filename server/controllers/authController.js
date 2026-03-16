const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register user (students only)
// @route   POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: "student",
            status: "approved",
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apply as instructor (faculty — pending approval)
// @route   POST /api/auth/apply-instructor
const applyInstructor = async (req, res) => {
    try {
        const { name, email, password, qualification, experience } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "An account with this email already exists" });
        }

        const avatarPath = req.file ? `/uploads/${req.file.filename}` : "";

        const user = await User.create({
            name,
            email,
            password,
            role: "faculty",
            status: "pending",
            qualification: qualification || "",
            experience: experience || "",
            avatar: avatarPath,
        });

        res.status(201).json({
            message: "Application submitted successfully. You will be notified once an admin reviews your request.",
            applicantId: user._id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Block pending/rejected instructor accounts
        if (user.role === "faculty") {
            if (user.status === "pending") {
                return res.status(403).json({
                    message: "Your instructor account is pending admin approval. Please wait for review.",
                });
            }
            if (user.status === "rejected") {
                return res.status(403).json({
                    message: "Your instructor application has been rejected. Please contact support for more information.",
                });
            }
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            avatar: user.avatar,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, applyInstructor, login, getMe };
