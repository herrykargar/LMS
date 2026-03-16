const Quiz = require("../models/Quiz");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Lesson = require("../models/Lesson");

// @desc    Get all quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
exports.getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ courseId: req.params.courseId });
        res.status(200).json(quizzes);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private/Faculty/Admin
exports.createQuiz = async (req, res) => {
    try {
        const { courseId, title, questions, timeLimit, passingScore } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Make sure user is course instructor
        if (course.instructorId.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({ message: "Not authorized to add quiz to this course" });
        }

        const quiz = await Quiz.create({
            courseId,
            title,
            questions,
            timeLimit,
            passingScore
        });

        res.status(201).json(quiz);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Faculty/Admin
exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const course = await Course.findById(quiz.courseId);

        if (course && course.instructorId.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({ message: "Not authorized to delete this quiz" });
        }

        await quiz.deleteOne();

        res.status(200).json({ message: "Quiz removed" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Submit quiz attempt and calculate score
// @route   POST /api/quizzes/:id/submit
// @access  Private/Student
exports.submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body; // Array of selected option indices (or option text, we'll use indices)
        // answers array format: [{ questionId: "...", selectedOption: index }]

        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const enrollment = await Enrollment.findOne({ userId: req.user.id, courseId: quiz.courseId });
        if (!enrollment) {
            return res.status(403).json({ message: "You must be enrolled to take this quiz" });
        }

        let totalPoints = 0;
        let earnedPoints = 0;

        quiz.questions.forEach((q) => {
            totalPoints += q.points;
            const studentAnswer = answers.find(a => a.questionId.toString() === q._id.toString());

            if (studentAnswer && studentAnswer.selectedOptionIndex === q.correctOptionIndex) {
                earnedPoints += q.points;
            }
        });

        const scorePercentage = (earnedPoints / totalPoints) * 100;

        // Check if previously taken
        const existingAttemptIndex = enrollment.completedQuizzes.findIndex(cq => cq.quizId.toString() === quiz._id.toString());

        if (existingAttemptIndex > -1) {
            // Update score if higher
            if (scorePercentage > enrollment.completedQuizzes[existingAttemptIndex].score) {
                enrollment.completedQuizzes[existingAttemptIndex].score = scorePercentage;
                await enrollment.save();
            }
        } else {
            // Add new attempt
            enrollment.completedQuizzes.push({ quizId: quiz._id, score: scorePercentage });
            await enrollment.save();
        }

        // Basic progress update logic
        const passed = scorePercentage >= quiz.passingScore;

        if (passed) {
            // Recalculate progress if passed
            const totalLessons = await Lesson.countDocuments({ courseId: quiz.courseId });
            const totalQuizzes = await Quiz.countDocuments({ courseId: quiz.courseId });
            const totalItems = totalLessons + totalQuizzes;
            const completedItems = enrollment.completedLessons.length + enrollment.completedQuizzes.length;

            enrollment.progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
            await enrollment.save();
        }

        res.status(200).json({
            score: scorePercentage,
            passed,
            earnedPoints,
            totalPoints,
            passingScore: quiz.passingScore
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
