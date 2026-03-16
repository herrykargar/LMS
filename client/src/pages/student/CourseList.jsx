import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/api";
import { FiSearch, FiBook, FiUser } from "react-icons/fi";

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    const categories = [
        "All",
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Design",
        "Business",
        "General",
    ];

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const params = {};
                if (search) params.search = search;
                if (category !== "All") params.category = category;
                const { data } = await getCourses(params);
                setCourses(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchCourses, 300);
        return () => clearTimeout(timer);
    }, [search, category]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    Explore Courses
                </span>
            </h1>
            <p className="text-slate-600 mb-8 font-medium">
                Find the perfect course to level up your skills.
            </p>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search courses..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-all shadow-sm focus:shadow-md"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-sm ${category === cat
                                ? "bg-amber-600 text-white shadow-amber-200"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <FiBook className="text-5xl text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No courses found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Link
                            key={course._id}
                            to={`/course/${course._id}`}
                            className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-sm hover:shadow-lg"
                        >
                            <div className="h-44 bg-gradient-to-br from-amber-50 to-cyan-50 flex items-center justify-center relative overflow-hidden border-b border-slate-100">
                                {course.thumbnail ? (
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <FiBook className="text-5xl text-amber-200" />
                                )}
                                {course.price > 0 && (
                                    <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-amber-600 text-sm font-bold rounded-lg shadow-sm border border-slate-100">
                                        ₹{course.price}
                                    </span>
                                )}
                                {course.price === 0 && (
                                    <span className="absolute top-3 right-3 px-3 py-1 bg-green-50 text-green-700 text-sm font-bold rounded-lg shadow-sm border border-green-100">
                                        Free
                                    </span>
                                )}
                            </div>
                            <div className="p-5">
                                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md">
                                    {course.category || "General"}
                                </span>
                                <h3 className="font-bold text-lg mt-2 mb-1 text-slate-900 group-hover:text-amber-600 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                                    {course.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 pt-3 border-t border-slate-50">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                        <FiUser className="text-xs text-slate-400" />
                                    </div>
                                    <span>{course.instructorName}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};


export default CourseList;

