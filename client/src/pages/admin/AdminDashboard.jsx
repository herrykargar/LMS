import { useState, useEffect } from "react";
import { getStats, getFacultyRequests } from "../../services/api";
import { FiUsers, FiBook, FiUserCheck, FiAward, FiUserPlus } from "react-icons/fi";

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [pendingRequests, setPendingRequests] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getStats();
                setStats(data);
                const { data: requests } = await getFacultyRequests("pending");
                setPendingRequests(requests.length);
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

    const statCards = [
        {
            label: "Total Users",
            value: stats.totalUsers,
            icon: FiUsers,
            color: "amber",
        },
        {
            label: "Students",
            value: stats.totalStudents,
            icon: FiUserCheck,
            color: "green",
        },
        {
            label: "Faculty",
            value: stats.totalFaculty,
            icon: FiAward,
            color: "yellow",
        },
        {
            label: "Courses",
            value: stats.totalCourses,
            icon: FiBook,
            color: "cyan",
        },
        {
            label: "Enrollments",
            value: stats.totalEnrollments,
            icon: FiUsers,
            color: "purple",
        },
        {
            label: "Lessons",
            value: stats.totalLessons,
            icon: FiBook,
            color: "rose",
        },
    ];

    const colorMap = {
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
        green: "bg-green-50 text-green-600 border-green-100",
        cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100",
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-slate-900">
                <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    Admin Overview
                </span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 -mr-12 -mt-12 rounded-full group-hover:scale-110 transition-transform"></div>

                            <div className="flex items-center gap-5 relative">
                                <div className={`p-4 rounded-2xl border ${colorMap[card.color]}`}>
                                    <Icon className="text-2xl" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
                                    <p className="text-3xl font-black text-slate-900">{card.value || 0}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Links */}
            <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                <div className="w-2 h-8 bg-amber-600 rounded-full"></div>
                System Control
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                    href="/admin/users"
                    className="group flex items-center gap-6 bg-white border border-slate-200 rounded-3xl p-8 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all"
                >
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl text-amber-600 group-hover:scale-110 transition-transform">
                        <FiUsers />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-slate-900 mb-1">Manage Users</p>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Control user access, assign roles (Student/Faculty), and manage account status across the platform.
                        </p>
                    </div>
                </a>
                <a
                    href="/admin/courses"
                    className="group flex items-center gap-6 bg-white border border-slate-200 rounded-3xl p-8 hover:border-cyan-500 shadow-sm hover:shadow-xl transition-all"
                >
                    <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center text-3xl text-cyan-600 group-hover:scale-110 transition-transform">
                        <FiBook />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-slate-900 mb-1">Global Course Management</p>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Oversee all published content, verify course quality, and manage listings for the entire marketplace.
                        </p>
                    </div>
                </a>
                <a
                    href="/admin/faculty-requests"
                    className="group flex items-center gap-6 bg-white border border-slate-200 rounded-3xl p-8 hover:border-green-500 shadow-sm hover:shadow-xl transition-all md:col-span-2"
                >
                    <div className="relative w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-3xl text-green-600 group-hover:scale-110 transition-transform">
                        <FiUserPlus />
                        {pendingRequests > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                {pendingRequests}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-xl font-bold text-slate-900 mb-1">Instructor Applications</p>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Review and approve new instructor requests.
                            {pendingRequests > 0 && (
                                <span className="ml-1 text-red-500 font-bold">{pendingRequests} pending review.</span>
                            )}
                        </p>
                    </div>
                </a>
            </div>
        </div>
    );
};


export default AdminDashboard;

