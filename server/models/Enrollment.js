const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        completedLessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Lesson",
            },
        ],
        completedQuizzes: [
            {
                quizId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Quiz",
                },
                score: {
                    type: Number,
                    default: 0,
                }
            }
        ]
    },
    { timestamps: true }
);

// Prevent duplicate enrollment
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
