import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    getCourse,
    enrollCourse,
    checkEnrollment,
    getQuizzes,
} from "../../services/api";
import DiscussionForum from "../../components/DiscussionForum";
import {
    FiPlay,
    FiFileText,
    FiUsers,
    FiClock,
    FiBook,
    FiCheckCircle,
    FiHelpCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

const CourseDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [enrollmentCount, setEnrollmentCount] = useState(0);
    const [enrolled, setEnrolled] = useState(false);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getCourse(id);
                setCourse(data.course);
                setLessons(data.lessons);
                setEnrollmentCount(data.enrollmentCount);

                const quizzesRes = await getQuizzes(id);
                setQuizzes(quizzesRes.data);

                if (user) {
                    const enrollRes = await checkEnrollment(id);
                    setEnrolled(enrollRes.data.enrolled);
                    setEnrollment(enrollRes.data.enrollment);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    const handleEnroll = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            await enrollCourse(id);
            setEnrolled(true);
            setEnrollmentCount((prev) => prev + 1);
            toast.success("Enrolled successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Enrollment failed");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-400">Course not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Hero */}
                    <div className="h-72 bg-gradient-to-br from-amber-50 to-cyan-50 rounded-2xl flex items-center justify-center overflow-hidden mb-8 border border-slate-100 shadow-sm">
                        {course.thumbnail ? (
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FiBook className="text-8xl text-amber-100" />
                        )}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 bg-amber-50 text-amber-600 rounded-full">
                            {course.category || "General"}
                        </span>
                        <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                        <span className="text-sm font-medium text-slate-500">{enrollmentCount} students</span>
                    </div>

                    <h1 className="text-4xl font-bold mb-3 text-slate-900 leading-tight">{course.title}</h1>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                            {course.instructorName ? course.instructorName[0] : 'I'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 leading-none mb-1">{course.instructorName}</p>
                            <p className="text-xs text-slate-500">Instructor & Course Creator</p>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none mb-12">
                        <h2 className="text-xl font-bold mb-4 text-slate-900 border-b border-slate-100 pb-2">Description</h2>
                        <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                            {course.description}
                        </p>
                    </div>

                    {/* Lessons */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">
                            Course Content
                        </h2>
                        <span className="text-sm font-medium text-slate-500">{lessons.length} sections</span>
                    </div>

                    <div className="space-y-4">
                        {lessons.map((lesson, index) => {
                            const isCompleted =
                                enrollment?.completedLessons?.includes(lesson._id);
                            return (
                                <div
                                    key={lesson._id}
                                    className="flex items-center gap-5 bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-500/30 transition-all shadow-sm group"
                                >
                                    <div
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-colors ${isCompleted
                                            ? "bg-green-50 text-green-600"
                                            : "bg-slate-50 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600"
                                            }`}
                                    >
                                        {isCompleted ? <FiCheckCircle /> : index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{lesson.title}</p>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1.5">
                                            {lesson.videoUrl && (
                                                <span className="flex items-center gap-1.5">
                                                    <FiPlay className="text-xs" /> Video Lesson
                                                </span>
                                            )}
                                            {lesson.notesFile && (
                                                <span className="flex items-center gap-1.5">
                                                    <FiFileText className="text-xs" /> PDF Resources
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {enrolled && (
                                        <Link
                                            to={`/course/${id}/lesson/${lesson._id}`}
                                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${isCompleted
                                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                : "bg-amber-600 text-white hover:bg-amber-700 shadow-sm hover:shadow-amber-200"
                                                }`}
                                        >
                                            {isCompleted ? "Review" : "Start"}
                                        </Link>
                                    )}
                                </div>
                            );
                        })}

                        {quizzes.map((quiz, index) => {
                            const completedQuiz = enrollment?.completedQuizzes?.find(q => q.quizId === quiz._id);
                            const isCompleted = !!completedQuiz;
                            const isPassed = completedQuiz && completedQuiz.score >= quiz.passingScore;

                            return (
                                <div
                                    key={quiz._id}
                                    className="flex items-center gap-5 bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-500/30 transition-all shadow-sm group"
                                >
                                    <div
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-colors ${isCompleted
                                            ? (isPassed ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")
                                            : "bg-amber-50 text-amber-600 group-hover:bg-amber-100 group-hover:text-amber-700"
                                            }`}
                                    >
                                        <FiHelpCircle />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{quiz.title}</p>
                                        <div className="flex items-center gap-4 text-sm mt-1.5 flex-wrap">
                                            <span className="text-slate-500 flex items-center gap-1.5">
                                                Quiz • {quiz.questions.length} Questions
                                            </span>
                                            {isCompleted && (
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    Score: {completedQuiz.score}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {enrolled && (
                                        <Link
                                            to={`/course/${id}/quiz/${quiz._id}`}
                                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${isCompleted && isPassed
                                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                : "bg-amber-600 text-white hover:bg-amber-700 shadow-sm hover:shadow-amber-200"
                                                }`}
                                        >
                                            {isCompleted && isPassed ? "Review" : (isCompleted ? "Retake" : "Start")}
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Discussions Section - Only for Enrolled Students or Instructor/Admin */}
                    {(enrolled || user?.role === "admin" || (course.instructorId && user?._id === course.instructorId)) && (
                        <div className="mt-12">
                            <DiscussionForum courseId={id} isInstructor={course.instructorId && user?._id === course.instructorId} />
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl overflow-hidden relative">
                        {/* Decorative background for price */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform"></div>

                        <div className="relative">
                            {course.price > 0 && (
                                <p className="text-4xl font-black mb-6 text-slate-900">₹{course.price}</p>
                            )}
                            {course.price === 0 && (
                                <div className="mb-6">
                                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg uppercase tracking-wider mb-2 inline-block border border-green-100">Most Popular</span>
                                    <p className="text-4xl font-black text-green-600">Free</p>
                                </div>
                            )}

                            {!enrolled ? (
                                user?.role === "student" || !user ? (
                                    <button
                                        onClick={() => {
                                            if (!user) { navigate("/login"); return; }
                                            if (course.price > 0) navigate(`/checkout/${id}`);
                                            else handleEnroll();
                                        }}
                                        className="w-full py-4 bg-amber-600 hover:bg-amber-700 rounded-2xl text-white font-bold transition-all shadow-lg hover:shadow-amber-200 cursor-pointer transform active:scale-[0.98]"
                                    >
                                        {course.price > 0 ? "Complete Purchase" : "Enroll for Free"}
                                    </button>
                                ) : (
                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                                        <p className="text-sm font-medium text-slate-600">You are logged in as {user.role}</p>
                                    </div>
                                )
                            ) : (
                                <div className="text-center">
                                    <p className="text-amber-600 font-bold flex items-center justify-center gap-2 mb-4">
                                        <FiCheckCircle /> You are enrolled
                                    </p>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-600 rounded-full"
                                                style={{ width: `${enrollment?.progress || 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                                            {enrollment?.progress || 0}% Done
                                        </span>
                                    </div>
                                    {enrollment?.progress === 100 && (
                                        <Link
                                            to={`/certificate/${id}`}
                                            className="block w-full py-3 bg-amber-500 hover:bg-amber-600 rounded-2xl text-white font-bold text-center transition-all shadow-md hover:shadow-amber-200"
                                        >
                                            🏆 Get My Certificate
                                        </Link>
                                    )}
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-slate-50 space-y-5">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">This course includes</p>
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                        <FiPlay className="text-amber-600" />
                                    </div>
                                    <span>{lessons.length} High-quality lessons</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                        <FiUsers className="text-amber-600" />
                                    </div>
                                    <span>Join {enrollmentCount} other students</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                        <FiClock className="text-amber-600" />
                                    </div>
                                    <span>Full lifetime access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;

