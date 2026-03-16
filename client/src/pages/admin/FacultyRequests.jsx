import { useState, useEffect } from "react";
import { getFacultyRequests, reviewFacultyRequest } from "../../services/api";
import {
    FiCheckCircle,
    FiXCircle,
    FiUser,
    FiMail,
    FiAward,
    FiBriefcase,
    FiClock,
    FiInbox,
} from "react-icons/fi";
import { toast } from "react-toastify";

const FacultyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("pending");
    const [actionLoading, setActionLoading] = useState(null); // id of row being actioned

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data } = await getFacultyRequests(filter);
            setRequests(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (id, action) => {
        setActionLoading(id);
        try {
            await reviewFacultyRequest(id, action);
            setRequests((prev) => prev.filter((r) => r._id !== id));
            toast.success(
                action === "approve"
                    ? "Instructor approved! They can now log in."
                    : "Application rejected."
            );
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        } finally {
            setActionLoading(null);
        }
    };

    const statusBadge = (status) => {
        const map = {
            pending: "bg-amber-50 text-amber-700 border-amber-100",
            approved: "bg-green-50 text-green-700 border-green-100",
            rejected: "bg-red-50 text-red-700 border-red-100",
        };
        return `px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${map[status]}`;
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                        Instructor Applications
                    </span>
                </h1>
                <p className="text-slate-500 mt-1 font-medium">
                    Review, approve, or reject instructor account requests.
                </p>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-6">
                {["pending", "approved", "rejected"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all cursor-pointer ${filter === s
                                ? "bg-amber-600 text-white shadow-lg"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-amber-500"
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-24">
                    <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Empty state */}
            {!loading && requests.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <FiInbox className="text-2xl text-slate-300" />
                    </div>
                    <p className="font-bold text-slate-900">No {filter} requests</p>
                    <p className="text-slate-500 text-sm mt-1">
                        There are no instructor applications with status "{filter}".
                    </p>
                </div>
            )}

            {/* Request cards */}
            {!loading && requests.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    {requests.map((req) => (
                        <div
                            key={req._id}
                            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-start gap-5">
                                {/* Avatar */}
                                <div className="shrink-0">
                                    {req.avatar ? (
                                        <img
                                            src={req.avatar}
                                            alt={req.name}
                                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
                                            <span className="text-white font-black text-lg">
                                                {req.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap mb-3">
                                        <span className="font-black text-slate-900 text-lg">
                                            {req.name}
                                        </span>
                                        <span className={statusBadge(req.status)}>
                                            {req.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                                        <span className="flex items-center gap-2">
                                            <FiMail className="text-amber-500 shrink-0" />
                                            <span className="truncate">{req.email}</span>
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <FiClock className="text-amber-500 shrink-0" />
                                            <span>
                                                Applied{" "}
                                                {new Date(req.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </span>
                                        {req.qualification && (
                                            <span className="flex items-start gap-2 md:col-span-2">
                                                <FiAward className="text-amber-500 shrink-0 mt-0.5" />
                                                <span>{req.qualification}</span>
                                            </span>
                                        )}
                                        {req.experience && (
                                            <span className="flex items-start gap-2 md:col-span-2">
                                                <FiBriefcase className="text-amber-500 shrink-0 mt-0.5" />
                                                <span>{req.experience}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions (only for pending) */}
                                {req.status === "pending" && (
                                    <div className="flex flex-col gap-2 shrink-0">
                                        <button
                                            onClick={() => handleReview(req._id, "approve")}
                                            disabled={actionLoading === req._id}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all cursor-pointer"
                                        >
                                            <FiCheckCircle />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReview(req._id, "reject")}
                                            disabled={actionLoading === req._id}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-100 text-sm font-bold rounded-xl transition-all cursor-pointer"
                                        >
                                            <FiXCircle />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultyRequests;
