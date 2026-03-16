import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyEnrollments } from "../../services/api";
import { FiBook, FiAward, FiTrendingUp } from "react-icons/fi";

const StudentDashboard = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getMyEnrollments();
                setEnrollments(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const completedCourses = enrollments.filter((e) => e.progress === 100);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">
                <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    Student Dashboard
                </span>
            </h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 rounded-lg">
                            <FiBook className="text-2xl text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Enrolled Courses</p>
                            <p className="text-2xl font-bold text-slate-900">{enrollments.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <FiAward className="text-2xl text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Completed</p>
                            <p className="text-2xl font-bold text-slate-900">{completedCourses.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 rounded-lg">
                            <FiTrendingUp className="text-2xl text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">In Progress</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {enrollments.length - completedCourses.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enrolled Courses */}
            <h2 className="text-xl font-semibold mb-6 text-slate-900 border-b border-slate-100 pb-2">My Courses</h2>
            {enrollments.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                    <FiBook className="text-5xl text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-6">
                        You have not enrolled in any courses yet.
                    </p>
                    <Link
                        to="/courses"
                        className="inline-block px-8 py-2.5 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-medium transition-all shadow-md hover:shadow-lg"
                    >
                        Browse Courses
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => (
                        <Link
                            key={enrollment._id}
                            to={`/course/${enrollment.courseId?._id}`}
                            className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md"
                        >
                            <div className="h-40 bg-gradient-to-br from-amber-50 to-cyan-50 flex items-center justify-center border-b border-slate-100">
                                {enrollment.courseId?.thumbnail ? (
                                    <img
                                        src={enrollment.courseId.thumbnail}
                                        alt={enrollment.courseId?.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FiBook className="text-5xl text-amber-200" />
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                                    {enrollment.courseId?.title || "Course"}
                                </h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    By {enrollment.courseId?.instructorName || "Instructor"}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-600 rounded-full transition-all"
                                            style={{ width: `${enrollment.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-600">
                                        {enrollment.progress}%
                                    </span>
                                </div>
                                {enrollment.progress === 100 && (
                                    <Link
                                        to={`/certificate/${enrollment.courseId?._id}`}
                                        className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-amber-600 hover:text-amber-700"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View Certificate
                                    </Link>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};


export default StudentDashboard;

