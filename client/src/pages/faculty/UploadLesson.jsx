import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    addLesson,
    getLessons,
    deleteLesson,
    getCourse,
} from "../../services/api";
import { FiUpload, FiTrash2, FiPlay, FiFileText, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";

const UploadLesson = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [form, setForm] = useState({ title: "" });
    const [video, setVideo] = useState(null);
    const [notes, setNotes] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await getCourse(courseId);
                setCourse(courseRes.data.course);
                const lessonsRes = await getLessons(courseId);
                setLessons(lessonsRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [courseId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title) return toast.error("Please enter a lesson title");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("courseId", courseId);
            formData.append("title", form.title);
            formData.append("order", lessons.length);
            if (video) formData.append("video", video);
            if (notes) formData.append("notes", notes);

            const { data } = await addLesson(formData);
            setLessons([...lessons, data]);
            setForm({ title: "" });
            setVideo(null);
            setNotes(null);
            toast.success("Lesson added!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add lesson");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLesson = async (id) => {
        if (!window.confirm("Delete this lesson?")) return;
        try {
            await deleteLesson(id);
            setLessons(lessons.filter((l) => l._id !== id));
            toast.success("Lesson deleted");
        } catch (err) {
            toast.error("Failed to delete lesson");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    Upload Lessons
                </span>
            </h1>
            <p className="text-slate-600 mb-8 font-medium">
                Course: <span className="text-amber-600 font-bold">{course?.title}</span>
            </p>

            {/* Upload Form */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-12 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-amber-600"></div>
                <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                    <FiPlus className="text-amber-600" /> Add New Lesson
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Lesson Title
                        </label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm"
                            placeholder="e.g., Master the useEffect Hook"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Video Stream (MP4)
                            </label>
                            <label className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 cursor-pointer transition-all">
                                <FiUpload className="text-xl" />
                                <span className="text-xs font-bold text-center px-4 line-clamp-1">
                                    {video ? video.name : "Select Video File"}
                                </span>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setVideo(e.target.files[0])}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Study Notes (PDF)
                            </label>
                            <label className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 cursor-pointer transition-all">
                                <FiUpload className="text-xl" />
                                <span className="text-xs font-bold text-center px-4 line-clamp-1">
                                    {notes ? notes.name : "Select PDF Notes"}
                                </span>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setNotes(e.target.files[0])}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl text-white font-black transition-all shadow-lg hover:shadow-amber-200 cursor-pointer transform active:scale-95"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Uploading Lesson...</span>
                            </div>
                        ) : (
                            "Upload Lesson"
                        )}
                    </button>
                </form>
            </div>

            {/* Existing Lessons */}
            <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-amber-600 rounded-full"></div>
                    Current Lessons ({lessons.length})
                </div>
            </h2>

            {lessons.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiPlay className="text-2xl text-slate-300" />
                    </div>
                    <p className="font-bold text-slate-900">No lessons uploaded</p>
                    <p className="text-slate-500 text-sm">Upload your first lesson to start building the course.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {lessons.map((lesson, index) => (
                        <div
                            key={lesson._id}
                            className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-sm font-black text-amber-700 shrink-0 border border-amber-100 shadow-inner">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-slate-900 leading-tight">{lesson.title}</p>
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                                    {lesson.videoUrl && (
                                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded border border-slate-100 text-slate-500">
                                            <FiPlay className="text-amber-600" /> Video Ready
                                        </span>
                                    )}
                                    {lesson.notesFile && (
                                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded border border-slate-100 text-slate-500">
                                            <FiFileText className="text-amber-600" /> Notes PDF
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteLesson(lesson._id)}
                                className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer group-hover:bg-slate-50"
                                title="Delete Lesson"
                            >
                                <FiTrash2 className="text-lg" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default UploadLesson;

