import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../../services/api";
import { FiUpload, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

const CreateCourse = () => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "General",
        price: 0,
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const categories = [
        "General",
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Design",
        "Business",
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("category", form.category);
            formData.append("price", form.price);
            if (thumbnail) formData.append("thumbnail", thumbnail);

            await createCourse(formData);
            toast.success("Course created successfully!");
            navigate("/faculty");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">
                <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    Create New Course
                </span>
            </h1>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Course Title
                        </label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm"
                            placeholder="e.g., Ultimate React & Next.js Masterclass"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Course Description
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm resize-none"
                            placeholder="What will students achieve by the end of this course?"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({ ...form, category: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Price (₹)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm({ ...form, price: Number(e.target.value) })
                                    }
                                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm font-bold"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 font-bold italic">Set to 0 for free courses</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Course Thumbnail
                        </label>
                        {preview ? (
                            <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-2 border-2 border-slate-100 shadow-inner group">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setThumbnail(null);
                                            setPreview(null);
                                        }}
                                        className="p-3 bg-white/90 hover:bg-red-600 hover:text-white rounded-full text-slate-900 transition-all font-bold shadow-xl cursor-pointer"
                                    >
                                        <FiX className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center gap-3 w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 cursor-pointer transition-all">
                                <div className="p-3 bg-white rounded-full shadow-sm">
                                    <FiUpload className="text-2xl" />
                                </div>
                                <span className="text-sm font-bold">Click to upload thumbnail</span>
                                <p className="text-[10px] opacity-70">PNG, JPG up to 10MB</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-2xl text-white font-black text-lg transition-all shadow-lg hover:shadow-amber-200 cursor-pointer transform active:scale-[0.98] mt-4"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Creating Course...</span>
                            </div>
                        ) : (
                            "Publish Course"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};


export default CreateCourse;

