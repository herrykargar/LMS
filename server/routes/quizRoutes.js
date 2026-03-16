const express = require("express");
const {
    getQuizzes,
    getQuiz,
    createQuiz,
    deleteQuiz,
    submitQuiz
} = require("../controllers/quizController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/course/:courseId", protect, getQuizzes);
router.get("/:id", protect, getQuiz);
router.post("/", protect, authorize("faculty", "admin"), createQuiz);
router.delete("/:id", protect, authorize("faculty", "admin"), deleteQuiz);
router.post("/:id/submit", protect, authorize("student"), submitQuiz);

module.exports = router;
