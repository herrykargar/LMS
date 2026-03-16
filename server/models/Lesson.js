const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Please add a lesson title"],
            trim: true,
        },
        videoUrl: {
            type: String,
            default: "",
        },
        videoSize: {
            type: Number,
            default: 0,
        },
        notesFile: {
            type: String,
            default: "",
        },
        notesSize: {
            type: Number,
            default: 0,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
