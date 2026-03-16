const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Lesson = require("../models/Lesson");

// @desc    Get all users (admin only)
// @route   GET /api/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role (admin only)
// @route   PUT /api/users/:id/role
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!["student", "faculty", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete user's enrollments
        await Enrollment.deleteMany({ userId: user._id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get public stats for landing page (no auth)
// @route   GET /api/users/public-stats
const getPublicStats = async (req, res) => {
    try {
        const totalCourses = await Course.countDocuments();
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalInstructors = await User.countDocuments({ role: "faculty" });
        const totalEnrollments = await Enrollment.countDocuments();

        res.json({ totalCourses, totalStudents, totalInstructors, totalEnrollments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats (admin)
// @route   GET /api/users/stats
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalFaculty = await User.countDocuments({ role: "faculty" });
        const totalCourses = await Course.countDocuments();
        const totalEnrollments = await Enrollment.countDocuments();
        const totalLessons = await Lesson.countDocuments();

        res.json({
            totalUsers,
            totalStudents,
            totalFaculty,
            totalCourses,
            totalEnrollments,
            totalLessons,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get faculty stats
// @route   GET /api/users/faculty-stats
const getFacultyStats = async (req, res) => {
    try {
        const totalCourses = await Course.countDocuments({
            instructorId: req.user._id,
        });

        const courseIds = await Course.find({ instructorId: req.user._id }).select(
            "_id"
        );
        const courseIdArray = courseIds.map((c) => c._id);

        const totalStudents = await Enrollment.countDocuments({
            courseId: { $in: courseIdArray },
        });

        const totalLessons = await Lesson.countDocuments({
            courseId: { $in: courseIdArray },
        });

        res.json({ totalCourses, totalStudents, totalLessons });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get pending faculty/instructor applications (admin)
// @route   GET /api/users/faculty-requests
const getFacultyRequests = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = { role: "faculty" };
        if (status) filter.status = status;
        else filter.status = "pending"; // default: pending

        const requests = await User.find(filter).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve or reject an instructor application (admin)
// @route   PUT /api/users/:id/review
const reviewFacultyRequest = async (req, res) => {
    try {
        const { action } = req.body; // "approve" | "reject"

        if (!["approve", "reject"].includes(action)) {
            return res.status(400).json({ message: "Invalid action. Use 'approve' or 'reject'." });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "faculty") {
            return res.status(400).json({ message: "This user is not an instructor applicant" });
        }

        user.status = action === "approve" ? "approved" : "rejected";
        await user.save();

        res.json({
            message: action === "approve"
                ? "Instructor approved successfully"
                : "Instructor application rejected",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    updateUserRole,
    deleteUser,
    getStats,
    getPublicStats,
    getFacultyStats,
    getFacultyRequests,
    reviewFacultyRequest,
};

