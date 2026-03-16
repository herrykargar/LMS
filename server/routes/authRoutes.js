const express = require("express");
const { register, applyInstructor, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/register", register);
router.post("/apply-instructor", upload.single("avatar"), applyInstructor);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
