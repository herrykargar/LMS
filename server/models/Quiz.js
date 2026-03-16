const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Please add a quiz title"],
            trim: true,
        },
        questions: [
            {
                questionText: {
                    type: String,
                    required: true,
                },
                options: [
                    {
                        type: String,
                        required: true,
                    }
                ],
                correctOptionIndex: {
                    type: Number,
                    required: true,
                },
                points: {
                    type: Number,
                    default: 1,
                }
            }
        ],
        timeLimit: {
            type: Number, // in minutes
            default: 10,
        },
        passingScore: {
            type: Number,
            default: 50, // percentage
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
