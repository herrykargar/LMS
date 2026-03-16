import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
    getCourse,
    updateProgress,
    checkEnrollment,
} from "../../services/api";
import {
    FiPlay,
    FiFileText,
    FiCheckCircle,
    FiChevronLeft,
    FiChevronRight,
    FiEye,
    FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const VideoPlayer = () => {
    const { courseId, lessonId } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);

    // PDF viewer state
    const [showPdf, setShowPdf] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getCourse(courseId);
                setCourse(data.course);
                setLessons(data.lessons);

                const current = data.lessons.find((l) => l._id === lessonId);
                setCurrentLesson(current);

                const enrollRes = await checkEnrollment(courseId);
                setEnrollment(enrollRes.data.enrollment);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        setShowPdf(false);
        setPageNumber(1);
    }, [courseId, lessonId]);

    // Block Ctrl+S and other save shortcuts
    const handleKeyDown = useCallback((e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const handleMarkComplete = async () => {
        try {
            const { data } = await updateProgress(courseId, currentLesson._id);
            setEnrollment(data);
            toast.success("Lesson marked as complete!");
        } catch (err) {
            toast.error("Failed to update progress");
        }
    };

    const blockContextMenu = (e) => e.preventDefault();

    const isCompleted = enrollment?.completedLessons?.includes(
        currentLesson?._id
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Back link */}
            <Link
                to={`/course/${courseId}`}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-amber-600 mb-4 transition-colors"
            >
                <FiChevronLeft /> Back to {course?.title}
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Video Area */}
                <div className="lg:col-span-3">
                    {/* Protected Video Player */}
                    <div
                        className="bg-black rounded-2xl overflow-hidden aspect-video mb-4 relative select-none"
                        onContextMenu={blockContextMenu}
                    >
                        {currentLesson?.videoUrl ? (
                            <>
                                <video
                                    src={`${import.meta.env.VITE_API_URL || ""}${currentLesson.videoUrl.replace("/uploads/", "/api/lessons/stream/")}`}
                                    controls
                                    controlsList="nodownload noplaybackrate"
                                    disablePictureInPicture
                                    playsInline
                                    preload="metadata"
                                    crossOrigin="anonymous"
                                    onContextMenu={blockContextMenu}
                                    className="w-full h-full"
                                    autoPlay
                                />
                                {/* Transparent overlay to prevent drag-save */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{ pointerEvents: "none" }}
                                />
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                <p>No video available for this lesson.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">{currentLesson?.title}</h1>
                            <p className="text-slate-500 mt-1">
                                {course?.title} • Lesson{" "}
                                {lessons.findIndex((l) => l._id === lessonId) + 1} of{" "}
                                {lessons.length}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {currentLesson?.notesFile && (
                                <button
                                    onClick={() => {
                                        setShowPdf(!showPdf);
                                        setPageNumber(1);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 rounded-lg text-sm transition-colors cursor-pointer text-white"
                                >
                                    {showPdf ? <FiX /> : <FiEye />}
                                    {showPdf ? "Close Notes" : "View Notes"}
                                </button>
                            )}
                            {!isCompleted ? (
                                <button
                                    onClick={handleMarkComplete}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm text-white transition-colors cursor-pointer"
                                >
                                    <FiCheckCircle /> Mark Complete
                                </button>
                            ) : (
                                <span className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm">
                                    <FiCheckCircle /> Completed
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Protected PDF Viewer */}
                    {showPdf && currentLesson?.notesFile && (
                        <div
                            className="bg-white rounded-2xl p-6 mb-6 border border-slate-200 shadow-lg select-none"
                            onContextMenu={blockContextMenu}
                            style={{ userSelect: "none", WebkitUserSelect: "none" }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                    <FiFileText className="text-amber-600" />
                                    Study Notes
                                </h3>
                                {numPages && (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                                            disabled={pageNumber <= 1}
                                            className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded-lg transition-colors cursor-pointer text-slate-700"
                                        >
                                            <FiChevronLeft />
                                        </button>
                                        <span className="text-xs font-bold text-slate-600">
                                            Page {pageNumber} of {numPages}
                                        </span>
                                        <button
                                            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                                            disabled={pageNumber >= numPages}
                                            className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded-lg transition-colors cursor-pointer text-slate-700"
                                        >
                                            <FiChevronRight />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div
                                className="flex justify-center overflow-auto max-h-[80vh] rounded-lg bg-slate-50 border border-slate-100"
                                onContextMenu={blockContextMenu}
                            >
                                <Document
                                    file={currentLesson.notesFile}
                                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                                    loading={
                                        <div className="flex items-center justify-center py-20">
                                            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    }
                                    error={
                                        <div className="text-center py-16 text-slate-500">
                                            <p className="font-bold">Unable to load PDF</p>
                                            <p className="text-sm mt-1">Please try refreshing the page.</p>
                                        </div>
                                    }
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        width={Math.min(700, window.innerWidth - 100)}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                </Document>
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    {enrollment && (
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-sm text-slate-500">Course Progress</span>
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all"
                                    style={{ width: `${enrollment.progress}%` }}
                                ></div>
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{enrollment.progress}%</span>
                        </div>
                    )}
                </div>

                {/* Sidebar — Lesson List */}
                <div className="lg:col-span-1">
                    <h3 className="font-semibold mb-3 text-slate-800">All Lessons</h3>
                    <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                        {lessons.map((lesson, index) => {
                            const isActive = lesson._id === lessonId;
                            const completed =
                                enrollment?.completedLessons?.includes(lesson._id);
                            return (
                                <Link
                                    key={lesson._id}
                                    to={`/course/${courseId}/lesson/${lesson._id}`}
                                    className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-colors ${isActive
                                        ? "bg-amber-100 border border-amber-200 text-amber-900"
                                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${completed
                                            ? "bg-green-100 text-green-600"
                                            : isActive
                                                ? "bg-amber-500 text-white"
                                                : "bg-slate-100 text-slate-500"
                                            }`}
                                    >
                                        {completed ? <FiCheckCircle /> : index + 1}
                                    </div>
                                    <span className="truncate">{lesson.title}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
