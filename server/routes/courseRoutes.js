const express = require("express");
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getMyCourses,
} = require("../controllers/courseController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getCourses);
router.get("/my", protect, authorize("faculty", "admin"), getMyCourses);
router.get("/:id", getCourse);
router.post(
    "/",
    protect,
    authorize("faculty", "admin"),
    upload.single("thumbnail"),
    createCourse
);
router.put(
    "/:id",
    protect,
    authorize("faculty", "admin"),
    upload.single("thumbnail"),
    updateCourse
);
router.delete("/:id", protect, authorize("faculty", "admin"), deleteCourse);

module.exports = router;
