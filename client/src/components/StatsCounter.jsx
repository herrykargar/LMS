import { useState, useEffect, useRef } from "react";

const StatsCounter = ({ end, label, icon: Icon, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const counted = useRef(false);

    useEffect(() => {
        // Reset if we have actual data now
        if (end > 0) {
            counted.current = false;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !counted.current) {
                    if (end > 0) {
                        counted.current = true;
                    }

                    if (end === 0) {
                        setCount(0);
                        return;
                    }

                    let start = 0;
                    const duration = 1500;
                    const step = Math.max(1, Math.ceil(end / (duration / 16)));
                    const timer = setInterval(() => {
                        start += step;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(start);
                        }
                    }, 16);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end]);

    return (
        <div ref={ref} className="flex flex-col items-center gap-2 px-6 py-4">
            {Icon && (
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-1">
                    <Icon className="text-amber-600 text-xl" />
                </div>
            )}
            <span className="text-3xl md:text-4xl font-black text-slate-900">
                {count.toLocaleString()}{suffix}
            </span>
            <span className="text-sm text-slate-500 font-medium">{label}</span>
        </div>
    );
};

export default StatsCounter;
