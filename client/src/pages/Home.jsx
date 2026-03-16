import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCourses, getPublicStats } from "../services/api";
import StatsCounter from "../components/StatsCounter";
import FAQAccordion from "../components/FAQAccordion";
import Footer from "../components/Footer";
import {
    FiBookOpen,
    FiPlay,
    FiAward,
    FiUsers,
    FiArrowRight,
    FiSearch,
    FiUser,
    FiBook,
    FiTarget,
    FiTrendingUp,
    FiStar,
    FiCheckCircle,
    FiMonitor,
    FiSmartphone,
    FiDatabase,
    FiPenTool,
    FiBriefcase,
    FiLayers,
    FiUserPlus,
    FiPlayCircle,
} from "react-icons/fi";

// ─── Category Data ───────────────────────────────────────────
const CATEGORIES = [
    { name: "Web Development", icon: FiMonitor, color: "bg-blue-50 text-blue-600" },
    { name: "Mobile Development", icon: FiSmartphone, color: "bg-purple-50 text-purple-600" },
    { name: "Data Science", icon: FiDatabase, color: "bg-emerald-50 text-emerald-600" },
    { name: "Design", icon: FiPenTool, color: "bg-pink-50 text-pink-600" },
    { name: "Business", icon: FiBriefcase, color: "bg-orange-50 text-orange-600" },
    { name: "General", icon: FiLayers, color: "bg-cyan-50 text-cyan-600" },
];

// ─── Testimonials Data ───────────────────────────────────────
const TESTIMONIALS = [
    {
        name: "Priya Sharma",
        role: "Computer Science Student",
        quote: "Learnify transformed the way I approach learning. The video lessons are clear, and getting a certificate at the end was incredibly motivating.",
        rating: 5,
    },
    {
        name: "Rahul Patel",
        role: "Web Developer",
        quote: "I switched my career to web development thanks to the quality courses here. The instructors really know their stuff and the content is always up to date.",
        rating: 5,
    },
    {
        name: "Ananya Desai",
        role: "Data Analyst",
        quote: "The data science courses gave me hands-on experience. I landed my first internship within two months of finishing the program.",
        rating: 4,
    },
];

// ─── FAQ Data ────────────────────────────────────────────────
const FAQ_ITEMS = [
    {
        question: "How do I create an account on Learnify?",
        answer: "Simply click the 'Join for Free' button and fill in your name, email, and password. You can sign up as a student or instructor. It takes less than a minute!",
    },
    {
        question: "Are the courses free?",
        answer: "Many courses on Learnify are completely free. Some premium courses may have a fee set by the instructor. You can filter by price when browsing.",
    },
    {
        question: "How do I earn a certificate?",
        answer: "Complete all the lessons in a course and your progress will reach 100%. Once fully completed, you can download your personalized certificate directly from your dashboard.",
    },
    {
        question: "Can I become an instructor on Learnify?",
        answer: "Yes! Register as a faculty member and you can create courses, upload video lessons, and manage your students through a dedicated dashboard.",
    },
    {
        question: "What technologies are the courses built around?",
        answer: "Our courses cover a wide range of subjects including Web Development, Mobile Development, Data Science, UI/UX Design, Business, and more.",
    },
    {
        question: "Is my progress saved automatically?",
        answer: "Yes. Your progress is tracked in real time. Every lesson you complete is recorded, so you can pick up exactly where you left off.",
    },
];

// ─── Goals Data ──────────────────────────────────────────────
const GOALS = [
    {
        icon: FiTarget,
        title: "Start My Career",
        desc: "Begin with beginner-friendly courses and build job-ready skills.",
        search: "beginner",
    },
    {
        icon: FiTrendingUp,
        title: "Level Up My Skills",
        desc: "Advance your expertise with intermediate and advanced courses.",
        search: "advanced",
    },
    {
        icon: FiAward,
        title: "Earn a Certificate",
        desc: "Complete courses to get recognized certificates for your resume.",
        search: "",
    },
    {
        icon: FiBookOpen,
        title: "Explore for Fun",
        desc: "Discover new topics across design, business, technology, and more.",
        search: "",
    },
];

// ═════════════════════════════════════════════════════════════
// Home Component
// ═════════════════════════════════════════════════════════════
const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, totalInstructors: 0, totalEnrollments: 0 });
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, coursesRes] = await Promise.all([
                    getPublicStats(),
                    getCourses({ limit: 6 }),
                ]);
                setStats(statsRes.data);
                setFeaturedCourses(coursesRes.data);
            } catch (err) {
                console.error("Failed to load landing data", err);
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate("/courses");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* ─── 1. HERO SECTION ──────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-slate-50 pt-16 pb-16 md:pt-16 md:pb-16 border-b border-slate-100">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-200/15 rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-6">
                            <FiStar className="text-amber-500" /> Trusted by {stats.totalStudents.toLocaleString()}+ learners
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-slate-900">
                            Learn Without{" "}
                            <span className="bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                                Limits
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
                            Access quality courses from expert instructors. Build real-world
                            skills at your own pace with video lessons, progress tracking, and
                            certificates of completion.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mb-8">
                            <div className="relative flex-1">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="What do you want to learn?"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all shadow-lg shadow-slate-100"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-8 py-4 bg-amber-600 hover:bg-amber-700 rounded-2xl text-white font-bold transition-all shadow-lg shadow-amber-200 active:scale-95 shrink-0 cursor-pointer"
                            >
                                Search
                            </button>
                        </form>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/courses"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 rounded-2xl text-white font-bold transition-all shadow-xl shadow-amber-200/50 active:scale-95"
                            >
                                Explore Courses <FiArrowRight />
                            </Link>
                            {!user && (
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 hover:border-amber-500 rounded-2xl text-slate-700 font-bold transition-all bg-white hover:text-amber-600 shadow-sm active:scale-95"
                                >
                                    Join for Free
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── 2. STATS BAR ─────────────────────────────────── */}
            <section className="bg-white border-y border-slate-100">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatsCounter end={stats.totalCourses} label="Courses" icon={FiBookOpen} suffix="+" />
                        <StatsCounter end={stats.totalStudents} label="Students" icon={FiUsers} suffix="+" />
                        <StatsCounter end={stats.totalInstructors} label="Instructors" icon={FiUser} suffix="+" />
                        <StatsCounter end={stats.totalEnrollments} label="Enrollments" icon={FiAward} suffix="+" />
                    </div>
                </div>
            </section>

            {/* ─── 3. EXPLORE CATEGORIES ────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                        Explore by <span className="text-amber-600">Category</span>
                    </h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Browse our wide range of categories and find courses that match your interests and career goals.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={cat.name}
                                to={`/courses?category=${encodeURIComponent(cat.name)}`}
                                className="group flex flex-col items-center gap-3 p-6 bg-white border border-slate-100 rounded-2xl hover:border-amber-400 hover:shadow-xl transition-all hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                                    <Icon className="text-2xl" />
                                </div>
                                <span className="text-sm font-semibold text-slate-700 text-center group-hover:text-amber-600 transition-colors">
                                    {cat.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* ─── 4. FEATURED COURSES ──────────────────────────── */}
            <section className="bg-slate-50 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                                Popular <span className="text-amber-600">Courses</span>
                            </h2>
                            <p className="text-slate-500">Handpicked courses from our top instructors.</p>
                        </div>
                        <Link
                            to="/courses"
                            className="hidden sm:inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                        >
                            View All <FiArrowRight />
                        </Link>
                    </div>

                    {loadingCourses ? (
                        <div className="flex justify-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
                        </div>
                    ) : featuredCourses.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                            <FiBook className="text-4xl text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">No courses available yet. Be the first to create one!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredCourses.map((course) => (
                                <Link
                                    key={course._id}
                                    to={`/course/${course._id}`}
                                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-400/60 transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl"
                                >
                                    <div className="h-44 bg-gradient-to-br from-amber-50 to-cyan-50 flex items-center justify-center relative overflow-hidden">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <FiBook className="text-5xl text-amber-200" />
                                        )}
                                        {course.price > 0 ? (
                                            <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-amber-600 text-sm font-bold rounded-lg shadow-sm">
                                                ₹{course.price}
                                            </span>
                                        ) : (
                                            <span className="absolute top-3 right-3 px-3 py-1 bg-green-50 text-green-700 text-sm font-bold rounded-lg shadow-sm">
                                                Free
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md">
                                            {course.category || "General"}
                                        </span>
                                        <h3 className="font-bold text-lg mt-2 mb-1 text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
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

                    <div className="sm:hidden text-center mt-8">
                        <Link
                            to="/courses"
                            className="inline-flex items-center gap-1 text-amber-600 font-semibold"
                        >
                            View All Courses <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── 5. HOW IT WORKS ──────────────────────────────── */}
            <section className="max-w-5xl mx-auto px-4 py-20">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                        How It <span className="text-amber-600">Works</span>
                    </h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Get started in three simple steps and begin your learning journey today.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connector line (desktop only) */}
                    <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"></div>

                    {[
                        { step: 1, icon: FiUserPlus, title: "Create Account", desc: "Sign up for free in under a minute. Choose your role as a student or instructor." },
                        { step: 2, icon: FiSearch, title: "Find a Course", desc: "Browse by category or search for topics that interest you. Preview before enrolling." },
                        { step: 3, icon: FiPlayCircle, title: "Start Learning", desc: "Watch video lessons, track your progress, and earn certificates when you finish." },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.step} className="relative flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-2xl mb-5 shadow-lg shadow-amber-200 relative z-10">
                                    <Icon />
                                </div>
                                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Step {item.step}</span>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ─── 6. LEARNING GOALS ────────────────────────────── */}
            <section className="bg-slate-50 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                            What Brings You to <span className="text-amber-600">Learnify</span>?
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Whatever your goal, we have the courses and tools to help you get there.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {GOALS.map((goal, i) => {
                            const Icon = goal.icon;
                            return (
                                <Link
                                    key={i}
                                    to={goal.search ? `/courses?search=${goal.search}` : "/courses"}
                                    className="group bg-white border border-slate-100 rounded-2xl p-7 hover:border-amber-400 hover:shadow-xl transition-all hover:-translate-y-1"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                        <Icon className="text-2xl text-amber-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{goal.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{goal.desc}</p>
                                    <span className="inline-flex items-center gap-1 text-amber-600 text-sm font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Explore <FiArrowRight />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── 7. TESTIMONIALS ──────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                        What Our <span className="text-amber-600">Learners</span> Say
                    </h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Real stories from real students who transformed their careers with Learnify.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={i}
                            className="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, j) => (
                                    <FiStar
                                        key={j}
                                        className={`text-sm ${j < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-slate-600 leading-relaxed mb-6 italic">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                                    <p className="text-xs text-slate-400">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── 8. PARTNER LOGOS ──────────────────────────────── */}
            <section className="bg-slate-50 py-16 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-10">
                        Learn Skills Demanded by Top Companies
                    </p>
                    <div className="flex items-center justify-center flex-wrap gap-8 md:gap-14 opacity-40">
                        {["Google", "Microsoft", "Amazon", "Meta", "IBM", "Adobe", "Tesla", "Netflix"].map((name) => (
                            <span
                                key={name}
                                className="text-xl md:text-2xl font-black text-slate-900 hover:text-amber-600 transition-colors cursor-default select-none"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── 9. FAQ ───────────────────────────────────────── */}
            <section id="faq" className="max-w-3xl mx-auto px-4 py-20">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                        Frequently Asked <span className="text-amber-600">Questions</span>
                    </h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Everything you need to know about getting started with Learnify.
                    </p>
                </div>

                <FAQAccordion items={FAQ_ITEMS} />
            </section>

            {/* ─── 10. CTA BANNER ───────────────────────────────── */}
            {!user && (
                <section className="max-w-5xl mx-auto px-4 py-10 pb-20">
                    <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-[2.5rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 -mr-36 -mt-36 rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 -ml-20 -mb-20 rounded-full"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white leading-tight">
                                Ready to Start Learning?
                            </h2>
                            <p className="text-amber-100 text-lg mb-10 max-w-2xl mx-auto font-medium">
                                Join {stats.totalStudents.toLocaleString()}+ students already learning on Learnify. Create your free account and start today.
                            </p>
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-amber-700 hover:bg-amber-50 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-white/20 active:scale-95"
                            >
                                Create Free Account <FiArrowRight className="text-xl" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ─── FOOTER ───────────────────────────────────────── */}
            <Footer />
        </div>
    );
};

export default Home;
