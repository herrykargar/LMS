const express = require("express");
const {
    getUsers,
    updateUserRole,
    deleteUser,
    getStats,
    getPublicStats,
    getFacultyStats,
    getFacultyRequests,
    reviewFacultyRequest,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route (no auth)
router.get("/public-stats", getPublicStats);

// Protected routes
router.get("/", protect, authorize("admin"), getUsers);
router.get("/stats", protect, authorize("admin"), getStats);
router.get("/faculty-stats", protect, authorize("faculty"), getFacultyStats);
router.get("/faculty-requests", protect, authorize("admin"), getFacultyRequests);
router.put("/:id/role", protect, authorize("admin"), updateUserRole);
router.put("/:id/review", protect, authorize("admin"), reviewFacultyRequest);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
