import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FAQAccordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="space-y-3">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-white transition-shadow hover:shadow-md"
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                    >
                        <span className="font-semibold text-slate-800 pr-4">
                            {item.question}
                        </span>
                        <FiChevronDown
                            className={`text-xl text-slate-400 shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""
                                }`}
                        />
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-96 pb-5 px-6" : "max-h-0"
                            }`}
                    >
                        <p className="text-slate-600 leading-relaxed">
                            {item.answer}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FAQAccordion;
