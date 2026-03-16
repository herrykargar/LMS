const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/lessons", require("./routes/lessonRoutes"));
app.use("/api/quizzes", require("./routes/quizRoutes"));
app.use("/api/enroll", require("./routes/enrollmentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/discussions", require("./routes/discussionRoutes"));

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Learnify API is running" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Server Error" });
});

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
