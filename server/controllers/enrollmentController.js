const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");

// @desc    Enroll in a course
// @route   POST /api/enroll
const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            userId: req.user._id,
            courseId,
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        const enrollment = await Enrollment.create({
            userId: req.user._id,
            courseId,
        });

        res.status(201).json(enrollment);
    } catch (error) {
        // Handle MongoDB Duplicate Key Error explicitly
        if (error.code === 11000) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my enrolled courses
// @route   GET /api/enroll/my
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ userId: req.user._id })
            .populate({
                path: "courseId",
                populate: { path: "instructorId", select: "name" },
            })
            .sort({ createdAt: -1 });

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update progress (mark lesson complete)
// @route   PUT /api/enroll/:courseId/progress
const updateProgress = async (req, res) => {
    try {
        const { lessonId } = req.body;

        const enrollment = await Enrollment.findOne({
            userId: req.user._id,
            courseId: req.params.courseId,
        });

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        // Add lesson to completed if not already there
        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
        }

        // Calculate progress percentage
        const totalLessons = await Lesson.countDocuments({
            courseId: req.params.courseId,
        });
        const totalQuizzes = await Quiz.countDocuments({
            courseId: req.params.courseId,
        });

        const totalItems = totalLessons + totalQuizzes;
        const completedItems = enrollment.completedLessons.length + (enrollment.completedQuizzes ? enrollment.completedQuizzes.length : 0);

        enrollment.progress =
            totalItems > 0
                ? Math.round((completedItems / totalItems) * 100)
                : 0;

        await enrollment.save();
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check enrollment status
// @route   GET /api/enroll/check/:courseId
const checkEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            userId: req.user._id,
            courseId: req.params.courseId,
        });

        res.json({ enrolled: !!enrollment, enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get students enrolled in a course (for faculty)
// @route   GET /api/enroll/course/:courseId/students
const getCourseStudents = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Only course instructor or admin can view
        if (
            course.instructorId.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const enrollments = await Enrollment.find({
            courseId: req.params.courseId,
        }).populate("userId", "name email");

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    enrollCourse,
    getMyEnrollments,
    updateProgress,
    checkEnrollment,
    getCourseStudents,
};
