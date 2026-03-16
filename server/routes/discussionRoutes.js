const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    getDiscussions,
    createDiscussion,
    deleteDiscussion,
    getReplies,
    addReply,
    deleteReply
} = require("../controllers/discussionController");

const router = express.Router();

router.get("/course/:courseId", protect, getDiscussions);
router.post("/", protect, createDiscussion);
router.delete("/:id", protect, deleteDiscussion);

router.get("/:id/replies", protect, getReplies);
router.post("/:id/replies", protect, addReply);
router.delete("/replies/:replyId", protect, deleteReply);

module.exports = router;
