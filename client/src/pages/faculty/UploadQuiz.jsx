import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    createQuiz,
    getQuizzes,
    deleteQuiz,
    getCourse,
} from "../../services/api";
import { FiTrash2, FiPlus, FiCheckCircle, FiHelpCircle } from "react-icons/fi";
import { toast } from "react-toastify";

const UploadQuiz = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [quizzes, setQuizzes] = useState([]);

    // Quiz Form State
    const [formTitle, setFormTitle] = useState("");
    const [formTimeLimit, setFormTimeLimit] = useState(10);
    const [formPassingScore, setFormPassingScore] = useState(50);
    const [questions, setQuestions] = useState([
        { questionText: "", options: ["", "", "", ""], correctOptionIndex: 0, points: 1 }
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await getCourse(courseId);
                setCourse(courseRes.data.course);
                const quizzesRes = await getQuizzes(courseId);
                setQuizzes(quizzesRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [courseId]);

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            { questionText: "", options: ["", "", "", ""], correctOptionIndex: 0, points: 1 }
        ]);
    };

    const handleRemoveQuestion = (index) => {
        if (questions.length === 1) return toast.error("Must have at least one question");
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleCorrectOptionChange = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctOptionIndex = oIndex;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formTitle.trim()) return toast.error("Quiz title is required");
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText.trim()) return toast.error(`Question ${i + 1} text is required`);
            for (let j = 0; j < q.options.length; j++) {
                if (!q.options[j].trim()) return toast.error(`Question ${i + 1} option ${j + 1} is required`);
            }
        }

        setLoading(true);
        try {
            const quizData = {
                courseId,
                title: formTitle,
                timeLimit: formTimeLimit,
                passingScore: formPassingScore,
                questions
            };

            const { data } = await createQuiz(quizData);
            setQuizzes([...quizzes, data]);

            // Reset Form
            setFormTitle("");
            setFormTimeLimit(10);
            setFormPassingScore(50);
            setQuestions([{ questionText: "", options: ["", "", "", ""], correctOptionIndex: 0, points: 1 }]);
            toast.success("Quiz created successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create quiz");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuiz = async (id) => {
        if (!window.confirm("Delete this quiz?")) return;
        try {
            await deleteQuiz(id);
            setQuizzes(quizzes.filter((q) => q._id !== id));
            toast.success("Quiz deleted");
        } catch (err) {
            toast.error("Failed to delete quiz");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    Manage Quizzes
                </span>
            </h1>
            <p className="text-slate-600 mb-8 font-medium">
                Course: <span className="text-amber-600 font-bold">{course?.title}</span>
            </p>

            {/* Create Quiz Form */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-12 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-amber-600"></div>
                <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                    <FiPlus className="text-amber-600" /> Create New Quiz
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Quiz Title
                            </label>
                            <input
                                type="text"
                                required
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm"
                                placeholder="e.g., Midterm Assessment"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Time Limit (Mins)
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formTimeLimit}
                                onChange={(e) => setFormTimeLimit(Number(e.target.value))}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Passing Score (%)
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="100"
                                value={formPassingScore}
                                onChange={(e) => setFormPassingScore(Number(e.target.value))}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Questions Area */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <h3 className="text-lg font-bold mb-4 text-slate-800">Questions</h3>

                        <div className="space-y-6">
                            {questions.map((q, qIndex) => (
                                <div key={qIndex} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative group">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveQuestion(qIndex)}
                                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Remove Question"
                                    >
                                        <FiTrash2 />
                                    </button>

                                    <div className="mb-4 pr-8">
                                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">
                                            Question {qIndex + 1}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={q.questionText}
                                            onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                                            placeholder="Enter question text here..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name={`correctOption_${qIndex}`}
                                                    checked={q.correctOptionIndex === oIndex}
                                                    onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                                                    className="w-5 h-5 text-amber-600 focus:ring-amber-500 border-slate-300"
                                                    title="Mark as correct answer"
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-amber-500 ${q.correctOptionIndex === oIndex ? 'border-amber-400 bg-amber-50/30' : 'border-slate-300'}`}
                                                    placeholder={`Option ${oIndex + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleAddQuestion}
                            className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-amber-200 border-dashed"
                        >
                            <FiPlus /> Add Another Question
                        </button>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-8 py-3.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl text-white font-black transition-all shadow-lg hover:shadow-amber-200 cursor-pointer transform active:scale-95"
                        >
                            {loading ? "Creating Quiz..." : "Save Quiz"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing Quizzes */}
            <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-amber-600 rounded-full"></div>
                    Current Quizzes ({quizzes.length})
                </div>
            </h2>

            {quizzes.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiHelpCircle className="text-2xl text-slate-300" />
                    </div>
                    <p className="font-bold text-slate-900">No quizzes available</p>
                    <p className="text-slate-500 text-sm">Create an assessment to test your students' knowledge.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizzes.map((quiz, index) => (
                        <div
                            key={quiz._id}
                            className="flex flex-col gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-slate-900 leading-tight">{quiz.title}</p>
                                    <p className="text-xs text-slate-500 mt-1">{quiz.questions.length} Questions • {quiz.timeLimit} mins</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteQuiz(quiz._id)}
                                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                    title="Delete Quiz"
                                >
                                    <FiTrash2 className="text-lg" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mt-auto pt-3 border-t border-slate-100">
                                <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded text-amber-600">
                                    <FiCheckCircle /> Pass: {quiz.passingScore}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UploadQuiz;
