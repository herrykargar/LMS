const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Please add a discussion title"],
            trim: true,
            maxlength: 150,
        },
        content: {
            type: String,
            required: [true, "Please add the discussion content"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Discussion", discussionSchema);
