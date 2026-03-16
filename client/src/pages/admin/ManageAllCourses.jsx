import { useState, useEffect } from "react";
import { getCourses, deleteCourse } from "../../services/api";
import { FiBook, FiTrash2, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

const ManageAllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await getCourses();
            setCourses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this course and all its lessons?")) return;
        try {
            await deleteCourse(id);
            setCourses(courses.filter((c) => c._id !== id));
            toast.success("Course deleted");
        } catch (err) {
            toast.error("Failed to delete course");
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
            <h1 className="text-3xl font-bold mb-8 text-slate-900">
                <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    Course Repository
                </span>
            </h1>

            {courses.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-20 text-center shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiBook className="text-5xl text-slate-200" />
                    </div>
                    <p className="text-xl font-bold text-slate-900 mb-2">No courses found</p>
                    <p className="text-slate-500 max-w-sm mx-auto">The system doesn't have any published courses yet. Faculty members can start creating content from their dashboard.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        Course Details
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell">
                                        Instructor
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell text-center">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                                        Actions
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
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-100 shadow-sm relative group">
                                                    {course.thumbnail ? (
                                                        <img
                                                            src={course.thumbnail}
                                                            alt=""
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                        />
                                                    ) : (
                                                        <FiBook className="text-amber-200 text-xl" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 mb-0.5">{course.title}</p>
                                                    <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-xs">
                                                        {course.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 hidden md:table-cell">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 text-[10px] font-black border border-amber-100">
                                                    <FiUser />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{course.instructorName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 hidden md:table-cell text-center">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                                                {course.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() => handleDelete(course._id)}
                                                    className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                                    title="Delete Course Globally"
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


export default ManageAllCourses;

