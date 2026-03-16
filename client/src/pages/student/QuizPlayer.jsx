import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getQuiz, submitQuiz, checkEnrollment } from "../../services/api";
import { FiClock, FiCheckCircle, FiXCircle, FiArrowLeft, FiAward } from "react-icons/fi";
import { toast } from "react-toastify";

const QuizPlayer = () => {
    const { courseId, quizId } = useParams();
    const navigate = useNavigate();

    // Data State
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Quiz Progress State
    const [answers, setAnswers] = useState([]); // [{ questionId, selectedOptionIndex }]
    const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
    const [isTimeUp, setIsTimeUp] = useState(false);

    // Results State
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                // Ensure student is enrolled
                const enrollRes = await checkEnrollment(courseId);
                if (!enrollRes.data.enrolled) {
                    toast.error("You are not enrolled in this course");
                    return navigate(`/course/${courseId}`);
                }

                const { data } = await getQuiz(quizId);
                setQuiz(data);
                setTimeRemaining(data.timeLimit * 60);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load quiz");
                navigate(`/course/${courseId}`);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [courseId, quizId, navigate]);

    // Timer logic
    useEffect(() => {
        if (!quiz || result || loading || isTimeUp) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsTimeUp(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quiz, result, loading, isTimeUp]);

    // Auto-submit when time is up
    useEffect(() => {
        if (isTimeUp && !result) {
            toast.warning("Time's up! Automatically submitting quiz...");
            handleSubmitQuiz();
        }
    }, [isTimeUp]);

    const handleOptionSelect = (questionId, optionIndex) => {
        setAnswers((prev) => {
            const existingIndex = prev.findIndex((a) => a.questionId === questionId);
            if (existingIndex > -1) {
                const newAnswers = [...prev];
                newAnswers[existingIndex] = { questionId, selectedOptionIndex: optionIndex };
                return newAnswers;
            } else {
                return [...prev, { questionId, selectedOptionIndex: optionIndex }];
            }
        });
    };

    const handleSubmitQuiz = async () => {
        setSubmitting(true);
        try {
            const { data } = await submitQuiz(quizId, { answers });
            setResult(data);
            window.scrollTo(0, 0);
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit quiz");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!quiz) return null;

    // Timer Formatting
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const isLowTime = timeRemaining < 60; // Less than 1 min red indicator

    // --- RESULTS VIEW ---
    if (result) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <Link to={`/course/${courseId}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-600 font-bold mb-8 transition-colors">
                    <FiArrowLeft /> Back to Course
                </Link>

                <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-3 ${result.passed ? 'bg-green-500' : 'bg-red-500'}`}></div>

                    <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl shadow-inner font-black">
                        {result.passed ? (
                            <div className="w-full h-full bg-green-50 text-green-500 flex items-center justify-center rounded-full border-4 border-white shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                <FiAward />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-red-50 text-red-500 flex items-center justify-center rounded-full border-4 border-white shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                                <FiXCircle />
                            </div>
                        )}
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {result.passed ? "Congratulations! You Passed" : "Keep Try! You Didn't Pass"}
                    </h1>

                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                        {result.passed
                            ? "Great job! Your score has been recorded and your course progress updated."
                            : `You need ${quiz.passingScore}% to pass. Review the material and try again.`}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex-1 min-w-[140px] max-w-[200px]">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Score</p>
                            <p className={`text-4xl font-black ${result.passed ? 'text-green-600' : 'text-red-500'}`}>{result.score.toFixed(0)}%</p>
                        </div>
                        <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex-1 min-w-[140px] max-w-[200px]">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Passing Score</p>
                            <p className="text-4xl font-black text-slate-800">{quiz.passingScore}%</p>
                        </div>
                        <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex-1 min-w-[140px] max-w-[200px]">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Points Earned</p>
                            <p className="text-4xl font-black text-slate-800">{result.earnedPoints} <span className="text-lg text-slate-400">/ {result.totalPoints}</span></p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                        >
                            Retake Quiz
                        </button>
                        <Link
                            to={`/course/${courseId}`}
                            className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95"
                        >
                            Continue Learning
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- TAKING QUIZ VIEW ---
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Sticky Header with Timer */}
            <div className="sticky top-0 bg-white border-b border-slate-200 z-40 shadow-sm py-4">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{quiz.title}</h1>
                        <p className="text-xs text-slate-500">{quiz.questions.length} Questions • {quiz.passingScore}% to pass</p>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black tracking-widest ${isLowTime ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-amber-50 text-amber-600'}`}>
                        <FiClock className="text-lg" />
                        <span>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
                {quiz.questions.map((q, index) => {
                    const selected = answers.find(a => a.questionId === q._id)?.selectedOptionIndex;

                    return (
                        <div key={q._id} className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
                            <div className="flex gap-4 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 shrink-0 flex items-center justify-center font-black text-slate-400 text-sm">
                                    {index + 1}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 leading-snug pt-1">
                                    {q.questionText}
                                    <span className="block text-xs font-medium text-amber-600 mt-2 uppercase tracking-wide">
                                        {q.points} Point{q.points > 1 ? 's' : ''}
                                    </span>
                                </h3>
                            </div>

                            <div className="space-y-3 pl-12">
                                {q.options.map((option, oIndex) => {
                                    const isSelected = selected === oIndex;
                                    return (
                                        <label
                                            key={oIndex}
                                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-amber-500 bg-amber-50/50' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-amber-500' : 'border-slate-300'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>}
                                            </div>
                                            <input
                                                type="radio"
                                                name={`question_${q._id}`}
                                                value={oIndex}
                                                className="hidden"
                                                onChange={() => handleOptionSelect(q._id, oIndex)}
                                                checked={isSelected}
                                            />
                                            <span className={`font-medium ${isSelected ? 'text-amber-900' : 'text-slate-700'}`}>
                                                {option}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSubmitQuiz}
                        disabled={submitting || answers.length !== quiz.questions.length}
                        className="px-10 py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-black text-lg transition-transform active:scale-95 shadow-xl hover:shadow-amber-200"
                    >
                        {submitting ? "Evaluating..." : "Submit Quiz"}
                    </button>
                </div>
                {answers.length !== quiz.questions.length && (
                    <p className="text-right text-sm text-amber-600 font-bold pr-2 -mt-4">
                        Please answer all {quiz.questions.length} questions before submitting.
                    </p>
                )}
            </div>
        </div>
    );
};

export default QuizPlayer;
