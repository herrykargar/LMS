import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { applyInstructor } from "../../services/api";
import {
    FiUser,
    FiMail,
    FiLock,
    FiBookOpen,
    FiAward,
    FiBriefcase,
    FiUpload,
    FiCheckCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

const ApplyInstructor = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        qualification: "",
        experience: "",
    });
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("password", form.password);
            formData.append("qualification", form.qualification);
            formData.append("experience", form.experience);
            if (avatar) formData.append("avatar", avatar);

            await applyInstructor(formData);
            setSubmitted(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Application failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-amber-50 via-white to-slate-100">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-xl">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                            <FiCheckCircle className="text-4xl text-green-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-3">Application Submitted!</h2>
                        <p className="text-slate-600 mb-2 font-medium">
                            Your instructor application is <span className="text-amber-600 font-bold">under review</span>.
                        </p>
                        <p className="text-slate-500 text-sm mb-8">
                            An admin will review your profile and credentials. Once approved, you can log in and start creating courses.
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-lg cursor-pointer"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-amber-50 via-white to-slate-100 py-12">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 text-3xl font-bold mb-2">
                        <FiBookOpen className="text-amber-600" />
                        <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                            Learnify
                        </span>
                    </div>
                    <h1 className="text-xl font-black text-slate-900 mt-1">Apply as an Instructor</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Submit your application and an admin will review it.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-500 to-amber-700 rounded-l-3xl" />

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                                Full Name
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                                    placeholder="Dr. John Smith"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                                Email
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                                    placeholder="instructor@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                        </div>

                        {/* Qualification */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                                Qualification
                            </label>
                            <div className="relative">
                                <FiAward className="absolute left-3 top-3.5 text-slate-400" />
                                <textarea
                                    required
                                    rows={2}
                                    value={form.qualification}
                                    onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all resize-none"
                                    placeholder="e.g. M.Sc. Computer Science, IIT Delhi"
                                />
                            </div>
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                                Teaching / Industry Experience
                            </label>
                            <div className="relative">
                                <FiBriefcase className="absolute left-3 top-3.5 text-slate-400" />
                                <textarea
                                    required
                                    rows={2}
                                    value={form.experience}
                                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all resize-none"
                                    placeholder="e.g. 5 years of web development, 2 years of teaching"
                                />
                            </div>
                        </div>

                        {/* Profile Photo */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                                Profile Photo <span className="text-slate-400 font-normal normal-case">(optional)</span>
                            </label>
                            <label className="flex items-center gap-3 w-full px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 cursor-pointer transition-all">
                                <FiUpload className="text-lg shrink-0" />
                                <span className="text-sm font-medium line-clamp-1">
                                    {avatar ? avatar.name : "Click to upload photo"}
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setAvatar(e.target.files[0])}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl text-white font-black transition-all shadow-lg hover:shadow-amber-200 cursor-pointer transform active:scale-95"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting Application...
                                </span>
                            ) : (
                                "Submit Application"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-amber-600 hover:text-amber-700 font-bold transition-colors">
                            Login
                        </Link>
                        {" · "}
                        <Link to="/signup" className="text-amber-600 hover:text-amber-700 font-bold transition-colors">
                            Sign up as Student
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ApplyInstructor;
