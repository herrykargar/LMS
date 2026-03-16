import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFacultyStats, getMyCourses } from "../../services/api";
import { FiBook, FiUsers, FiPlay, FiPlus } from "react-icons/fi";

const FacultyDashboard = () => {
    const [stats, setStats] = useState({});
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, coursesRes] = await Promise.all([
                    getFacultyStats(),
                    getMyCourses(),
                ]);
                setStats(statsRes.data);
                setCourses(coursesRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                        Faculty Dashboard
                    </span>
                </h1>
                <Link
                    to="/faculty/create-course"
                    className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 rounded-xl text-white font-medium transition-all shadow-md hover:shadow-lg"
                >
                    <FiPlus className="text-lg" /> New Course
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm border-l-4 border-l-amber-600">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-amber-50 rounded-2xl">
                            <FiBook className="text-2xl text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">My Courses</p>
                            <p className="text-3xl font-black text-slate-900">{stats.totalCourses || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm border-l-4 border-l-green-500">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-green-50 rounded-2xl">
                            <FiUsers className="text-2xl text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Students</p>
                            <p className="text-3xl font-black text-slate-900">{stats.totalStudents || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-amber-50 rounded-2xl">
                            <FiPlay className="text-2xl text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Lessons</p>
                            <p className="text-3xl font-black text-slate-900">{stats.totalLessons || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Courses */}
            <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                <div className="w-2 h-8 bg-amber-600 rounded-full"></div>
                My Courses
            </h2>
            {courses.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiBook className="text-4xl text-slate-300" />
                    </div>
                    <p className="text-xl font-bold text-slate-900 mb-2">No courses yet</p>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start sharing your knowledge! Create your first course and reach thousands of students.</p>
                    <Link
                        to="/faculty/create-course"
                        className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-700 rounded-xl text-white font-bold transition-all shadow-lg hover:shadow-amber-200"
                    >
                        Create Your First Course
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border-b-4 border-b-amber-50"
                        >
                            <div className="h-44 bg-gradient-to-br from-amber-50 to-cyan-50 flex items-center justify-center relative overflow-hidden group">
                                {course.thumbnail ? (
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <FiBook className="text-6xl text-amber-100" />
                                )}
                                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-lg mb-2 text-slate-900">{course.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">
                                    {course.description}
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        to={`/faculty/manage-courses`}
                                        className="text-center py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold border border-slate-100 text-slate-700 transition-all"
                                    >
                                        Manage Info
                                    </Link>
                                    <Link
                                        to={`/faculty/upload-lesson/${course._id}`}
                                        className="text-center py-2.5 bg-amber-600 hover:bg-amber-700 rounded-xl text-sm font-bold text-white transition-all shadow-sm hover:shadow-amber-200"
                                    >
                                        Add Lesson
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default FacultyDashboard;

