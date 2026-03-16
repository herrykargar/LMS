import { Link } from "react-router-dom";
import { FiBookOpen, FiMail, FiMapPin, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

const Footer = () => {
    const categories = [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Design",
        "Business",
    ];

    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                            <FiBookOpen className="text-amber-400 text-2xl" />
                            <span>Learnify</span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            Empowering learners worldwide with quality courses, expert instructors, and recognized certificates.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-600 flex items-center justify-center transition-colors">
                                <FiTwitter className="text-sm" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-600 flex items-center justify-center transition-colors">
                                <FiLinkedin className="text-sm" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-600 flex items-center justify-center transition-colors">
                                <FiGithub className="text-sm" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/courses" className="hover:text-amber-400 transition-colors">Browse Courses</Link></li>
                            <li><Link to="/signup" className="hover:text-amber-400 transition-colors">Create Account</Link></li>
                            <li><Link to="/login" className="hover:text-amber-400 transition-colors">Sign In</Link></li>
                            <li><a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Categories</h4>
                        <ul className="space-y-2.5 text-sm">
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <Link
                                        to={`/courses?category=${encodeURIComponent(cat)}`}
                                        className="hover:text-amber-400 transition-colors"
                                    >
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Contact</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2.5">
                                <FiMail className="mt-0.5 text-amber-400 shrink-0" />
                                <span>support@learnify.com</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <FiMapPin className="mt-0.5 text-amber-400 shrink-0" />
                                <span>Gujarat, India</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Learnify. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
