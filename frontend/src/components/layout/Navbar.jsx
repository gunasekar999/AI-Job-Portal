import { NavLink } from "react-router-dom";
import {
    Briefcase,
    BrainCircuit,
    FileText,
    Sparkles,
    Target,
} from "lucide-react";

const Navbar = () => {
    const navItem = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${isActive
            ? "bg-blue-600 text-white shadow-lg"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }`;

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">

            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}

                <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">

                        <Briefcase
                            className="text-white"
                            size={24}
                        />

                    </div>

                    <div>

                        <h1 className="text-2xl font-bold text-gray-900">
                            AI Job Portal
                        </h1>

                        <p className="text-sm text-gray-500">
                            Smart Career Platform
                        </p>

                    </div>

                </div>


                {/* Navigation */}

                <nav className="flex items-center gap-4">

                    <NavLink
                        to="/ai/resume"
                        className={navItem}
                    >
                        <FileText size={18} />
                        Resume AI
                    </NavLink>


                    <NavLink
                        to="/ai/recommendations"
                        className={navItem}
                    >
                        <Sparkles size={18} />
                        Recommendations
                    </NavLink>


                    <NavLink
                        to="/ai/interview-questions"
                        className={navItem}
                    >
                        <BrainCircuit size={18} />
                        Interview AI
                    </NavLink>


                    <NavLink
                        to="/ai/matches"
                        className={navItem}
                    >
                        <Target size={18} />
                        My AI Matches
                    </NavLink>

                </nav>

            </div>

        </header>
    );
};

export default Navbar;