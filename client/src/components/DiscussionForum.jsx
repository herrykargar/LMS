import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
    getDiscussions,
    createDiscussion,
    deleteDiscussion,
    getReplies,
    addReply,
    deleteReply,
} from "../services/api";
import { FiMessageSquare, FiSend, FiTrash2, FiUser, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { toast } from "react-toastify";

const DiscussionForum = ({ courseId, isInstructor }) => {
    const { user } = useAuth();
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    const [expandedDiscId, setExpandedDiscId] = useState(null);
    const [replies, setReplies] = useState([]);
    const [loadingReplies, setLoadingReplies] = useState(false);

    const [newReply, setNewReply] = useState("");
    const [isReplying, setIsReplying] = useState(false);

    useEffect(() => {
        const fetchDiscussions = async () => {
            try {
                const { data } = await getDiscussions(courseId);
                setDiscussions(data);
            } catch (err) {
                console.error(err);
                if (err.response?.status !== 403) {
                    toast.error("Failed to load discussions");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDiscussions();
    }, [courseId]);

    const handleCreateDiscussion = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return toast.error("Title and content are required");

        setIsPosting(true);
        try {
            const { data } = await createDiscussion({ courseId, title: newTitle, content: newContent });
            setDiscussions([data, ...discussions]);
            setNewTitle("");
            setNewContent("");
            toast.success("Discussion posted!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to post discussion");
        } finally {
            setIsPosting(false);
        }
    };

    const handleDeleteDiscussion = async (id) => {
        if (!window.confirm("Delete this discussion and all its replies?")) return;
        try {
            await deleteDiscussion(id);
            setDiscussions(discussions.filter(d => d._id !== id));
            if (expandedDiscId === id) setExpandedDiscId(null);
            toast.success("Discussion deleted");
        } catch (err) {
            toast.error("Failed to delete discussion");
        }
    };

    const toggleExpand = async (id) => {
        if (expandedDiscId === id) {
            setExpandedDiscId(null);
            return;
        }

        setExpandedDiscId(id);
        setLoadingReplies(true);
        try {
            const { data } = await getReplies(id);
            setReplies(data);
        } catch (err) {
            toast.error("Failed to load replies");
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleAddReply = async (e, discussionId) => {
        e.preventDefault();
        if (!newReply.trim()) return;

        setIsReplying(true);
        try {
            const { data } = await addReply(discussionId, { content: newReply });
            setReplies([...replies, data]);
            setNewReply("");

            // Increment reply count in main list
            setDiscussions(discussions.map(d =>
                d._id === discussionId ? { ...d, replyCount: (d.replyCount || 0) + 1 } : d
            ));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to post reply");
        } finally {
            setIsReplying(false);
        }
    };

    const handleDeleteReply = async (replyId, discussionId) => {
        if (!window.confirm("Delete this reply?")) return;
        try {
            await deleteReply(replyId);
            setReplies(replies.filter(r => r._id !== replyId));

            // Decrement reply count in main list
            setDiscussions(discussions.map(d =>
                d._id === discussionId ? { ...d, replyCount: Math.max(0, (d.replyCount || 0) - 1) } : d
            ));
            toast.success("Reply deleted");
        } catch (err) {
            toast.error("Failed to delete reply");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString() + " at " +
            new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return <div className="py-10 text-center text-slate-400">Loading discussions...</div>;
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <FiMessageSquare className="text-xl" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Course Discussions</h2>
                    <p className="text-sm text-slate-500">Ask questions, share ideas, and connect with others.</p>
                </div>
            </div>

            {/* Post New Discussion Form */}
            <div className="mb-10 bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                <h3 className="font-bold text-slate-800 mb-4">Start a new discussion</h3>
                <form onSubmit={handleCreateDiscussion} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Discussion Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <textarea
                        placeholder="What's on your mind? Ask a question or share a thought..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        required
                        rows="3"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                    ></textarea>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isPosting}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                        >
                            {isPosting ? "Posting..." : <><FiSend /> Post Discussion</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Discussions List */}
            <div className="space-y-4">
                {discussions.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <p>No discussions yet. Be the first to start one!</p>
                    </div>
                ) : (
                    discussions.map(discussion => {
                        const isExpanded = expandedDiscId === discussion._id;
                        const canDelete = user?.role === "admin" || isInstructor || discussion.userId?._id === user?._id;

                        return (
                            <div key={discussion._id} className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300">
                                {/* Discussion Header / Summary */}
                                <div
                                    onClick={() => toggleExpand(discussion._id)}
                                    className={`p-5 cursor-pointer hover:bg-slate-50 transition-colors ${isExpanded ? 'bg-slate-50 border-b border-slate-200' : ''}`}
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-slate-900 mb-1">{discussion.title}</h3>
                                            <p className="text-sm text-slate-600 line-clamp-2 mb-3">{discussion.content}</p>

                                            <div className="flex items-center gap-4 text-xs font-medium">
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                    <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                                                        {discussion.userId?.avatar ?
                                                            <img src={discussion.userId.avatar} alt="avatar" className="w-full h-full object-cover" /> :
                                                            <FiUser />
                                                        }
                                                    </div>
                                                    <span className={discussion.userId?.role === 'faculty' ? 'text-amber-600 font-bold' : ''}>
                                                        {discussion.userId?.name || "Unknown User"}
                                                        {discussion.userId?.role === 'faculty' && " (Instructor)"}
                                                    </span>
                                                </div>
                                                <span className="text-slate-400">•</span>
                                                <span className="text-slate-500">{formatDate(discussion.createdAt)}</span>
                                                <span className="text-slate-400">•</span>
                                                <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                                                    {discussion.replyCount || 0} Replies
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {canDelete && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteDiscussion(discussion._id); }}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Discussion"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            )}
                                            <div className="text-slate-400">
                                                {isExpanded ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded View (Replies) */}
                                {isExpanded && (
                                    <div className="bg-slate-50/50 p-5">
                                        {/* Original Post Full */}
                                        <div className="bg-white p-5 rounded-xl border border-slate-100 mb-6 shadow-sm">
                                            <p className="text-slate-800 whitespace-pre-wrap">{discussion.content}</p>
                                        </div>

                                        {/* Replies List */}
                                        <div className="pl-6 border-l-2 border-indigo-100 space-y-4 mb-6">
                                            {loadingReplies ? (
                                                <div className="text-sm text-slate-400 py-2">Loading replies...</div>
                                            ) : replies.length === 0 ? (
                                                <div className="text-sm text-slate-400 py-2">No replies yet.</div>
                                            ) : (
                                                replies.map(reply => {
                                                    const canDeleteReply = user?.role === "admin" || isInstructor || reply.userId?._id === user?._id;
                                                    const isInstructorReply = reply.userId?.role === 'faculty';

                                                    return (
                                                        <div key={reply._id} className={`p-4 rounded-xl border ${isInstructorReply ? 'bg-amber-50/30 border-amber-100' : 'bg-white border-slate-100'}`}>
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs overflow-hidden ${isInstructorReply ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                                                        {reply.userId?.avatar ?
                                                                            <img src={reply.userId.avatar} alt="avatar" className="w-full h-full object-cover" /> : <FiUser />
                                                                        }
                                                                    </div>
                                                                    <span className={`text-xs font-bold ${isInstructorReply ? 'text-amber-700' : 'text-slate-700'}`}>
                                                                        {reply.userId?.name || "Unknown"} {isInstructorReply && " (Instructor)"}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400">{formatDate(reply.createdAt)}</span>
                                                                </div>
                                                                {canDeleteReply && (
                                                                    <button
                                                                        onClick={() => handleDeleteReply(reply._id, discussion._id)}
                                                                        className="text-slate-300 hover:text-red-500 transition-colors"
                                                                    >
                                                                        <FiTrash2 className="text-xs" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-slate-700 whitespace-pre-wrap pl-8">{reply.content}</p>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>

                                        {/* Add Reply Form */}
                                        <div className="pl-6 ml-0.5">
                                            <form onSubmit={(e) => handleAddReply(e, discussion._id)} className="flex gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Write a reply..."
                                                    value={newReply}
                                                    onChange={(e) => setNewReply(e.target.value)}
                                                    className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={isReplying || !newReply.trim()}
                                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                                                >
                                                    {isReplying ? "..." : "Reply"}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
};

export default DiscussionForum;
