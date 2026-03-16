import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCourseStudents, getCourse } from "../../services/api";
import { FiUsers, FiUser } from "react-icons/fi";

const StudentsList = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await getCourse(courseId);
                setCourse(courseRes.data.course);
                const studentsRes = await getCourseStudents(courseId);
                setStudents(studentsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    Enrolled Students
                </span>
            </h1>
            <p className="text-slate-600 mb-8 font-medium">
                Course: <span className="text-amber-600 font-bold">{course?.title}</span>
            </p>

            {students.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiUsers className="text-4xl text-slate-300" />
                    </div>
                    <p className="text-xl font-bold text-slate-900 mb-2">No students yet</p>
                    <p className="text-slate-500">When students enroll in this course, they will appear here.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Student Info
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Email Address
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Learning Progress
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((enrollment) => (
                                    <tr
                                        key={enrollment._id}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                                                    <FiUser className="text-amber-600" />
                                                </div>
                                                <span className="font-bold text-slate-900">{enrollment.userId?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-600">
                                            {enrollment.userId?.email}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-600 rounded-full transition-all duration-1000"
                                                        style={{ width: `${enrollment.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                                                    {enrollment.progress}%
                                                </span>
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


export default StudentsList;

