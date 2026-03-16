const express = require("express");
const {
    getLessons,
    addLesson,
    updateLesson,
    deleteLesson,
    streamVideo,
} = require("../controllers/lessonController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

const lessonUpload = upload.fields([
    { name: "video", maxCount: 1 },
    { name: "notes", maxCount: 1 },
]);

// Public streaming route (no auth — video files are already public via /uploads)
router.get("/stream/:filename", streamVideo);

router.get("/:courseId", getLessons);
router.post("/", protect, authorize("faculty", "admin"), lessonUpload, addLesson);
router.put("/:id", protect, authorize("faculty", "admin"), lessonUpload, updateLesson);
router.delete("/:id", protect, authorize("faculty", "admin"), deleteLesson);

module.exports = router;
