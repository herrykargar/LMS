import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiBookOpen, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const dashboardLink = () => {
        if (!user) return "/login";
        if (user.role === "admin") return "/admin";
        if (user.role === "faculty") return "/faculty";
        return "/student";
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                        <FiBookOpen className="text-amber-600 text-2xl" />
                        <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                            Learnify
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            to="/courses"
                            className="text-slate-600 hover:text-amber-600 transition-colors font-medium"
                        >
                            Courses
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to={dashboardLink()}
                                    className="text-slate-600 hover:text-amber-600 transition-colors font-medium"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center gap-3 ml-4">
                                    <span className="text-sm text-slate-700 font-medium">
                                        {user.name}{" "}
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 capitalize">
                                            {user.role}
                                        </span>
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                                    >
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="text-slate-600 hover:text-amber-600 transition-colors font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-slate-600 text-2xl cursor-pointer"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {menuOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <Link
                            to="/courses"
                            className="block py-2 text-slate-600 hover:text-amber-600"
                            onClick={() => setMenuOpen(false)}
                        >
                            Courses
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    to={dashboardLink()}
                                    className="block py-2 text-slate-600 hover:text-amber-600"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMenuOpen(false);
                                    }}
                                    className="block py-2 text-red-600 cursor-pointer"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block py-2 text-slate-600"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block py-2 text-amber-600"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

