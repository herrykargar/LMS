const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");

// @desc    Get all courses (with search)
// @route   GET /api/courses
const getCourses = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }
        if (category && category !== "All") {
            query.category = category;
        }

        const courses = await Course.find(query)
            .populate("instructorId", "name email")
            .sort({ createdAt: -1 })
            .limit(req.query.limit ? parseInt(req.query.limit) : 0);

        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single course with lessons
// @route   GET /api/courses/:id
const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate(
            "instructorId",
            "name email"
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const lessons = await Lesson.find({ courseId: course._id }).sort({
            order: 1,
        });
        const enrollmentCount = await Enrollment.countDocuments({
            courseId: course._id,
        });

        res.json({ course, lessons, enrollmentCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create course
// @route   POST /api/courses
const createCourse = async (req, res) => {
    try {
        const { title, description, category, price } = req.body;

        const course = await Course.create({
            title,
            description,
            instructorId: req.user._id,
            instructorName: req.user.name,
            thumbnail: req.file ? `/uploads/${req.file.filename}` : "",
            category: category || "General",
            price: price || 0,
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
const updateCourse = async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Only owner faculty or admin can update
        if (
            course.instructorId.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updates = { ...req.body };
        if (req.file) {
            updates.thumbnail = `/uploads/${req.file.filename}`;
        }

        course = await Course.findByIdAndUpdate(req.params.id, updates, {
            new: true,
        });

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Only owner faculty or admin can delete
        if (
            course.instructorId.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Delete associated lessons and enrollments
        await Lesson.deleteMany({ courseId: course._id });
        await Enrollment.deleteMany({ courseId: course._id });
        await Course.findByIdAndDelete(req.params.id);

        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get courses by faculty
// @route   GET /api/courses/my
const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructorId: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getMyCourses,
};
