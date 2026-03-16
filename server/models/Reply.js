const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
    {
        discussionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Discussion",
            required: true,
            index: true, // Optimize for finding all replies to a discussion
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: [true, "Please add reply content"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reply", replySchema);
