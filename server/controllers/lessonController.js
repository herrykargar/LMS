const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const path = require("path");
const fs = require("fs");

// @desc    Get lessons for a course
// @route   GET /api/lessons/:courseId
const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({ courseId: req.params.courseId }).sort({
            order: 1,
        });
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add lesson to course
// @route   POST /api/lessons
const addLesson = async (req, res) => {
    try {
        const { courseId, title, order } = req.body;

        // Verify course exists and user is the instructor
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (
            course.instructorId.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        let videoUrl = "";
        let videoSize = 0;
        let notesFile = "";
        let notesSize = 0;

        if (req.files) {
            if (req.files.video) {
                videoUrl = `/uploads/${req.files.video[0].filename}`;
                videoSize = req.files.video[0].size;
            }
            if (req.files.notes) {
                notesFile = `/uploads/${req.files.notes[0].filename}`;
                notesSize = req.files.notes[0].size;
            }
        }

        const lesson = await Lesson.create({
            courseId,
            title,
            videoUrl,
            videoSize,
            notesFile,
            notesSize,
            order: order || 0,
        });

        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
const updateLesson = async (req, res) => {
    try {
        let lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        const course = await Course.findById(lesson.courseId);
        if (
            course.instructorId.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updates = { ...req.body };

        if (req.files) {
            if (req.files.video) {
                updates.videoUrl = `/uploads/${req.files.video[0].filename}`;
                updates.videoSize = req.files.video[0].size;
            }
            if (req.files.notes) {
                updates.notesFile = `/uploads/${req.files.notes[0].filename}`;
                updates.notesSize = req.files.notes[0].size;
            }
        }

        lesson = await Lesson.findByIdAndUpdate(req.params.id, updates, {
            new: true,
        });

        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        const course = await Course.findById(lesson.courseId);
        if (
            course.instructorId.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Lesson.findByIdAndDelete(req.params.id);
        res.json({ message: "Lesson deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Stream video file in chunks (HTTP Range Requests)
// @route   GET /api/lessons/stream/:filename
const streamVideo = (req, res) => {
    const filename = req.params.filename;
    const videoPath = path.join(__dirname, "..", "uploads", filename);

    // Check if file exists
    if (!fs.existsSync(videoPath)) {
        return res.status(404).json({ message: "Video not found" });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Determine content type from extension
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        ".mp4": "video/mp4",
        ".webm": "video/webm",
        ".ogg": "video/ogg",
        ".mov": "video/quicktime",
    };
    const contentType = mimeTypes[ext] || "video/mp4";

    if (range) {
        // Parse Range header: "bytes=start-end"
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks (better for high-latency tunnels)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : Math.min(start + CHUNK_SIZE, fileSize - 1);

        const contentLength = end - start + 1;

        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": contentType,
            "Cache-Control": "no-cache",
        });

        fs.createReadStream(videoPath, { start, end }).pipe(res);
    } else {
        // No Range header — send full file
        res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": contentType,
        });

        fs.createReadStream(videoPath).pipe(res);
    }
};

module.exports = { getLessons, addLesson, updateLesson, deleteLesson, streamVideo };
