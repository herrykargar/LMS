const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please add a course title"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
        },
        instructorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        instructorName: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            default: "General",
        },
        price: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
