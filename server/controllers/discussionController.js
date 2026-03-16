const Discussion = require("../models/Discussion");
const Reply = require("../models/Reply");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// Helper to check if user has access to course discussions
const checkAccess = async (courseId, userId, userRole) => {
    // Admin always has access
    if (userRole === "admin") return true;

    // Check if instructor of the course
    const course = await Course.findById(courseId);
    if (course && course.instructorId.toString() === userId.toString()) return true;

    // Check if enrolled student
    const enrollment = await Enrollment.findOne({ courseId, userId });
    return !!enrollment;
};

// @desc    Get all discussions for a course
// @route   GET /api/discussions/course/:courseId
// @access  Private (Enrolled students, Instructor, Admin)
exports.getDiscussions = async (req, res) => {
    try {
        const { courseId } = req.params;

        const hasAccess = await checkAccess(courseId, req.user._id, req.user.role);
        if (!hasAccess) {
            return res.status(403).json({ message: "Not authorized to view discussions for this course" });
        }

        // Fetch discussions and populate user details
        const discussions = await Discussion.find({ courseId })
            .populate("userId", "name role avatar")
            .sort({ createdAt: -1 }); // Newest first

        // Count replies for each discussion
        const discussionsWithCounts = await Promise.all(
            discussions.map(async (discussion) => {
                const replyCount = await Reply.countDocuments({ discussionId: discussion._id });
                return { ...discussion.toObject(), replyCount };
            })
        );

        res.status(200).json(discussionsWithCounts);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Create a new discussion
// @route   POST /api/discussions
// @access  Private
exports.createDiscussion = async (req, res) => {
    try {
        const { courseId, title, content } = req.body;

        const hasAccess = await checkAccess(courseId, req.user._id, req.user.role);
        if (!hasAccess) {
            return res.status(403).json({ message: "Not authorized to post in this course" });
        }

        const discussion = await Discussion.create({
            courseId,
            userId: req.user._id,
            title,
            content
        });

        // Return populated version for immediate UI update
        const populatedDiscussion = await Discussion.findById(discussion._id).populate("userId", "name role avatar");

        res.status(201).json(populatedDiscussion);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Delete a discussion
// @route   DELETE /api/discussions/:id
// @access  Private (Author, Course Instructor, Admin)
exports.deleteDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found" });
        }

        const course = await Course.findById(discussion.courseId);

        // Authorization check: User is author OR instructor of the course OR admin
        const isAuthor = discussion.userId.toString() === req.user._id.toString();
        const isInstructor = course && course.instructorId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isAuthor && !isInstructor && !isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this discussion" });
        }

        // Delete all replies associated with this discussion
        await Reply.deleteMany({ discussionId: discussion._id });
        await discussion.deleteOne();

        res.status(200).json({ message: "Discussion deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get replies for a discussion
// @route   GET /api/discussions/:id/replies
// @access  Private
exports.getReplies = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found" });
        }

        const hasAccess = await checkAccess(discussion.courseId, req.user._id, req.user.role);
        if (!hasAccess) {
            return res.status(403).json({ message: "Not authorized to view these replies" });
        }

        const replies = await Reply.find({ discussionId: req.params.id })
            .populate("userId", "name role avatar")
            .sort({ createdAt: 1 }); // Oldest first (chronological order)

        res.status(200).json(replies);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Add a reply to a discussion
// @route   POST /api/discussions/:id/replies
// @access  Private
exports.addReply = async (req, res) => {
    try {
        const { content } = req.body;

        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found" });
        }

        const hasAccess = await checkAccess(discussion.courseId, req.user._id, req.user.role);
        if (!hasAccess) {
            return res.status(403).json({ message: "Not authorized to reply" });
        }

        const reply = await Reply.create({
            discussionId: req.params.id,
            userId: req.user._id,
            content
        });

        const populatedReply = await Reply.findById(reply._id).populate("userId", "name role avatar");

        res.status(201).json(populatedReply);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Delete a reply
// @route   DELETE /api/discussions/replies/:replyId
// @access  Private (Author, Course Instructor, Admin)
exports.deleteReply = async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.replyId).populate("discussionId");
        if (!reply) {
            return res.status(404).json({ message: "Reply not found" });
        }

        const course = await Course.findById(reply.discussionId.courseId);

        const isAuthor = reply.userId.toString() === req.user._id.toString();
        const isInstructor = course && course.instructorId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isAuthor && !isInstructor && !isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this reply" });
        }

        await reply.deleteOne();

        res.status(200).json({ message: "Reply deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
