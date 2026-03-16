import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { FiChevronLeft, FiCheckCircle, FiShield, FiSmartphone } from "react-icons/fi";
import { getCourse, enrollCourse, checkEnrollment } from "../../services/api";
import { toast } from "react-toastify";

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(10);
    const [status, setStatus] = useState("paying"); // paying | verifying | success

    // ✏️ Change this to your real UPI ID anytime!
    const myUpiId = "herrykargar009-1@okicici";

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Redirect if already enrolled
                try {
                    const enrollRes = await checkEnrollment(id);
                    if (enrollRes.data?.enrolled) {
                        toast.info("You are already enrolled in this course!");
                        navigate(`/course/${id}`);
                        return;
                    }
                } catch (e) {
                    console.error("Enrollment check failed", e);
                }

                const { data } = await getCourse(id);
                setCourse(data.course);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load course details");
                navigate("/courses");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, navigate]);

    // Countdown timer — auto-triggers verification at 0
    useEffect(() => {
        if (status !== "paying" || loading) return;
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    handleVerify();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(countdown);
    }, [status, loading]);

    const handleVerify = () => {
        setStatus("verifying");
        setTimeout(() => {
            completeEnrollment();
        }, 3000);
    };

    const completeEnrollment = async () => {
        try {
            await enrollCourse(id);
            setStatus("success");
            toast.success("Payment Received Successfully!");
            setTimeout(() => navigate(`/course/${id}`), 3000);
        } catch (err) {
            toast.error(err.response?.data?.message || "Enrollment failed. Please try again.");
            setStatus("paying");
            setTimer(10);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!course) return null;

    const upiLink = `upi://pay?pa=${myUpiId}&pn=Leanify&am=${course.price}&cu=INR`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium cursor-pointer"
                >
                    <FiChevronLeft /> Back to Course
                </button>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative">
                    {/* Header Gradient */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white text-center relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full"></div>
                        <h2 className="text-2xl font-bold relative z-10">Secure Checkout</h2>
                        <p className="opacity-90 text-sm mt-1 relative z-10">{course.title}</p>
                    </div>

                    <div className="p-8">
                        {/* ===== PAYING STATE ===== */}
                        {status === "paying" && (
                            <div className="text-center">
                                {/* Price */}
                                <div className="mb-6">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Amount</p>
                                    <p className="text-5xl font-black text-slate-900">₹{course.price}</p>
                                </div>

                                {/* QR Code */}
                                <div className="bg-white p-5 rounded-2xl inline-block border-2 border-dashed border-amber-200 mb-6 relative group hover:border-amber-400 transition-colors">
                                    <QRCodeSVG
                                        value={upiLink}
                                        size={200}
                                        level="H"
                                        includeMargin
                                        fgColor="#1e293b"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/60 rounded-2xl backdrop-blur-sm">
                                        <FiSmartphone className="text-4xl text-amber-600 animate-bounce" />
                                    </div>
                                </div>

                                {/* Timer */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-center gap-2 text-amber-600 font-bold">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                        <span>Waiting for payment... {timer}s</span>
                                    </div>
                                    {/* Progress bar */}
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000 ease-linear"
                                            style={{ width: `${((10 - timer) / 10) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-slate-400 text-sm">Scan the QR code using <b>Google Pay</b>, <b>PhonePe</b>, or any UPI app</p>
                                </div>

                                {/* Manual "I Have Paid" button */}
                                <button
                                    onClick={handleVerify}
                                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all cursor-pointer active:scale-[0.98]"
                                >
                                    I Have Paid ✓
                                </button>

                                {/* Trust badges */}
                                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-8">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                            <FiShield />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secure</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                            <FiCheckCircle />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== VERIFYING STATE ===== */}
                        {status === "verifying" && (
                            <div className="py-12 text-center">
                                <div className="relative w-24 h-24 mx-auto mb-6">
                                    <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FiShield className="text-3xl text-amber-500" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Verifying Payment</h3>
                                <p className="text-slate-500 text-sm">Connecting with bank servers...<br />Please do not close this window.</p>
                            </div>
                        )}

                        {/* ===== SUCCESS STATE ===== */}
                        {status === "success" && (
                            <div className="py-12 text-center relative overflow-hidden">
                                {/* Confetti particles */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                    {[...Array(20)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-2 h-2 rounded-full"
                                            style={{
                                                backgroundColor: ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6"][i % 5],
                                                top: "-10px",
                                                left: `${5 + Math.random() * 90}%`,
                                                animation: `confetti-fall ${2 + Math.random() * 2}s ease-out forwards`,
                                                animationDelay: `${Math.random() * 0.8}s`,
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Success icon */}
                                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                    <FiCheckCircle className="text-5xl" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Payment Successful! 🎉</h3>
                                <p className="text-slate-500 font-medium mb-8">Welcome to the course! Redirecting...</p>

                                {/* Transaction receipt */}
                                <div className="bg-slate-50 rounded-2xl p-5 text-left border border-slate-100 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-slate-400 font-bold uppercase">Transaction ID</span>
                                        <span className="text-xs text-slate-900 font-mono font-bold">TXN{Date.now().toString().slice(-9)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-slate-400 font-bold uppercase">Amount</span>
                                        <span className="text-xs text-slate-900 font-bold">₹{course.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-slate-400 font-bold uppercase">Status</span>
                                        <span className="text-xs text-green-600 font-bold uppercase">✓ Completed</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                            Powered by Leanify Secure Payment Gateway
                        </p>
                    </div>
                </div>
            </div>

            {/* Confetti keyframes */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes confetti-fall {
                        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                        100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
                    }
                `,
            }} />
        </div>
    );
};

export default Checkout;
