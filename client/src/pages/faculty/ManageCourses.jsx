import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyCourses, deleteCourse, updateCourse } from "../../services/api";
import { FiEdit, FiTrash2, FiPlus, FiBook } from "react-icons/fi";
import { toast } from "react-toastify";

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [updatingParams, setUpdatingParams] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await getMyCourses();
            setCourses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await deleteCourse(id);
            setCourses(courses.filter((c) => c._id !== id));
            toast.success("Course deleted");
        } catch (err) {
            toast.error("Failed to delete course");
        }
    };

    const handleEditStart = (course) => {
        setEditingId(course._id);
        setEditTitle(course.title);
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditTitle("");
    };

    const handleEditSave = async (courseId) => {
        if (!editTitle.trim()) {
            toast.error("Course title cannot be empty");
            return;
        }

        setUpdatingParams(courseId);
        try {
            const formData = new FormData();
            formData.append("title", editTitle);

            await updateCourse(courseId, formData);
            setCourses(courses.map(c => c._id === courseId ? { ...c, title: editTitle } : c));
            toast.success("Course name updated");
            setEditingId(null);
        } catch (err) {
            toast.error("Failed to update course name");
        } finally {
            setUpdatingParams(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                        Manage Courses
                    </span>
                </h1>
                <Link
                    to="/faculty/create-course"
                    className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 rounded-xl text-white font-medium transition-all shadow-md hover:shadow-lg"
                >
                    <FiPlus className="text-lg" /> New Course
                </Link>
            </div>

            {courses.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiBook className="text-4xl text-slate-300" />
                    </div>
                    <p className="text-xl font-bold text-slate-900 mb-2">No courses yet</p>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't created any courses. Start by creating your first course today!</p>
                    <Link
                        to="/faculty/create-course"
                        className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-700 rounded-xl text-white font-bold transition-all shadow-lg hover:shadow-amber-200"
                    >
                        Create Course
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Course Details
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell text-center">
                                        Pricing
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                                        Management
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {courses.map((course) => (
                                    <tr
                                        key={course._id}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-50 to-cyan-50 flex items-center justify-center shrink-0 overflow-hidden border border-slate-100 shadow-sm">
                                                    {course.thumbnail ? (
                                                        <img
                                                            src={course.thumbnail}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <FiBook className="text-amber-200 text-xl" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    {editingId === course._id ? (
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <input
                                                                type="text"
                                                                value={editTitle}
                                                                onChange={(e) => setEditTitle(e.target.value)}
                                                                className="px-3 py-1 bg-white border border-slate-200 text-sm font-bold rounded focus:outline-none focus:border-amber-500 w-full"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => handleEditSave(course._id)}
                                                                disabled={updatingParams === course._id}
                                                                className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded font-bold transition-colors cursor-pointer disabled:opacity-50"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={handleEditCancel}
                                                                disabled={updatingParams === course._id}
                                                                className="text-xs px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded font-bold transition-colors cursor-pointer disabled:opacity-50"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <p className="font-bold text-slate-900">{course.title}</p>
                                                            <button
                                                                onClick={() => handleEditStart(course)}
                                                                className="text-slate-400 hover:text-amber-600 p-1 rounded-md transition-colors cursor-pointer"
                                                                title="Edit Course Name"
                                                            >
                                                                <FiEdit className="text-sm" />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <p className="text-sm text-slate-500 line-clamp-1 max-w-xs">
                                                        {course.description}
                                                    </p>
                                                </div>

                                            </div>
                                        </td>
                                        <td className="px-6 py-5 hidden md:table-cell">
                                            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg border border-amber-100/50">
                                                {course.category || "General"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 hidden md:table-cell text-center">
                                            {course.price > 0 ? (
                                                <span className="font-bold text-slate-900">₹{course.price}</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-tighter rounded-md border border-green-100">Free</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    to={`/faculty/upload-lesson/${course._id}`}
                                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-xl text-xs font-bold text-white transition-all shadow-sm hover:shadow-amber-200"
                                                >
                                                    Add Lesson
                                                </Link>
                                                <Link
                                                    to={`/faculty/upload-quiz/${course._id}`}
                                                    className="px-4 py-2 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded-xl text-xs font-bold transition-all shadow-sm"
                                                >
                                                    Quizzes
                                                </Link>
                                                <Link
                                                    to={`/faculty/discussions/${course._id}`}
                                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 rounded-xl text-xs font-bold transition-all shadow-sm"
                                                >
                                                    Discussions
                                                </Link>
                                                <Link
                                                    to={`/faculty/students/${course._id}`}
                                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all"
                                                >
                                                    Students
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(course._id)}
                                                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                                    title="Delete Course"
                                                >
                                                    <FiTrash2 className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};


export default ManageCourses;

