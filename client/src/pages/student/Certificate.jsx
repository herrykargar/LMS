import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCourse } from "../../services/api";
import { jsPDF } from "jspdf";
import { FiDownload, FiAward } from "react-icons/fi";

const Certificate = () => {
    const { courseId } = useParams();
    const { user } = useAuth();    
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await getCourse(courseId);
                setCourse(data.course);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourse();
    }, [courseId]);

    const generateCertificate = () => {
        const doc = new jsPDF({ orientation: "landscape" });

        // Background
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 297, 210, "F");

        // Border
        doc.setDrawColor(99, 102, 241);
        doc.setLineWidth(3);
        doc.rect(15, 15, 267, 180);
        doc.setDrawColor(14, 165, 233);
        doc.setLineWidth(1);
        doc.rect(20, 20, 257, 170);

        // Title
        doc.setTextColor(99, 102, 241);
        doc.setFontSize(36);
        doc.setFont("helvetica", "bold");
        doc.text("CERTIFICATE", 148.5, 55, { align: "center" });

        doc.setTextColor(14, 165, 233);
        doc.setFontSize(14);
        doc.text("OF COMPLETION", 148.5, 65, { align: "center" });

        // Body
        doc.setTextColor(226, 232, 240);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("This is to certify that", 148.5, 85, { align: "center" });

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text(user?.name || "Student", 148.5, 102, { align: "center" });

        doc.setTextColor(226, 232, 240);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("has successfully completed the course", 148.5, 118, {
            align: "center",
        });

        doc.setTextColor(245, 158, 11);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(course?.title || "Course", 148.5, 135, { align: "center" });

        doc.setTextColor(148, 163, 184);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(
            `Instructor: ${course?.instructorName || "Instructor"}`,
            148.5,
            150,
            { align: "center" }
        );

        // Date
        const today = new Date().toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        doc.text(`Date: ${today}`, 148.5, 160, { align: "center" });

        // Footer
        doc.setTextColor(99, 102, 241);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Learnify", 148.5, 180, { align: "center" });

        doc.setTextColor(148, 163, 184);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Online Learning Platform", 148.5, 186, { align: "center" });

        doc.save(`Learnify_Certificate_${course?.title || "Course"}.pdf`);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <FiAward className="text-6xl text-amber-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Congratulations! {user?.name}</h1>
                <p className="text-slate-400">
                    You have completed{" "}
                    <span className="text-amber-400 font-medium">{course?.title}</span>
                </p>
            </div>

            {/* Certificate Preview */}
            <div className="bg-slate-900 border-2 border-amber-500 rounded-2xl p-12 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-2xl m-3"></div>

                <div className="text-center relative z-10">
                    <h2 className="text-amber-400 text-3xl font-bold mb-1">
                        CERTIFICATE
                    </h2>
                    <p className="text-cyan-400 text-sm tracking-widest mb-8">
                        OF COMPLETION
                    </p>

                    <p className="text-slate-400 mb-2">This is to certify that</p>
                    <p className="text-3xl font-bold text-white mb-2">{user?.name}</p>
                    <p className="text-slate-400 mb-4">
                        has successfully completed the course
                    </p>
                    <p className="text-xl font-bold text-amber-400 mb-4">
                        {course?.title}
                    </p>
                    <p className="text-slate-500 text-sm mb-6">
                        Instructor: {course?.instructorName}
                    </p>

                    <p className="text-amber-400 font-bold text-lg">Learnify</p>
                    <p className="text-slate-500 text-xs">Online Learning Platform</p>
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={generateCertificate}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-700 rounded-xl text-white font-semibold transition-colors cursor-pointer"
                >
                    <FiDownload /> Download Certificate (PDF)
                </button>
            </div>
        </div>
    );
};

export default Certificate;

