import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourse } from "../../services/api";
import { FiArrowLeft, FiMessageSquare } from "react-icons/fi";
import DiscussionForum from "../../components/DiscussionForum";

const ManageDiscussions = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const { data } = await getCourse(courseId);
                setCourse(data.course);
            } catch (err) {
                console.error("Error fetching course:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20 text-slate-500">
                Course not found or you don't have access.
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <Link
                to="/faculty/manage-courses"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-600 font-bold mb-6 transition-colors"
            >
                <FiArrowLeft /> Back to Courses
            </Link>

            <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-50 to-cyan-50 flex items-center justify-center text-amber-500 text-3xl shrink-0 overflow-hidden shadow-inner">
                    {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                        <FiMessageSquare />
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 mb-1">
                        Course Discussions
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {course.title}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-amber-50 border-b border-amber-100 p-6">
                    <h2 className="text-amber-900 font-bold flex items-center gap-2">
                        <FiMessageSquare className="text-amber-600" /> Instructor Moderation View
                    </h2>
                    <p className="text-sm text-amber-700/80 mt-1">
                        As an instructor, you can read all discussions, reply to students, and delete inappropriate content. Your replies will be highlighted.
                    </p>
                </div>
                <div className="p-2 md:p-6 bg-slate-50">
                    <DiscussionForum courseId={courseId} isInstructor={true} />
                </div>
            </div>
        </div>
    );
};

export default ManageDiscussions;
