const express = require("express");
const {
    enrollCourse,
    getMyEnrollments,
    updateProgress,
    checkEnrollment,
    getCourseStudents,
} = require("../controllers/enrollmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("student"), enrollCourse);
router.get("/my", protect, getMyEnrollments);
router.put("/:courseId/progress", protect, updateProgress);
router.get("/check/:courseId", protect, checkEnrollment);
router.get(
    "/course/:courseId/students",
    protect,
    authorize("faculty", "admin"),
    getCourseStudents
);

module.exports = router;
