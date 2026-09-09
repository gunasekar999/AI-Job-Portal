import { useEffect, useState } from "react";

import {
    LayoutDashboard,
    User,
    FileText,
    Briefcase,
    Building2,
    BrainCircuit,
    Sparkles,
    Settings,
    LogOut,
    ClipboardList,
    Target,
    Users,
    ShieldCheck,
} from "lucide-react";

import {
    NavLink,
    useNavigate,
} from "react-router-dom";

import {
    getMyProfile,
} from "../../services/profileServices";


const Sidebar = () => {

    const navigate = useNavigate();

    const [role, setRole] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Load Current User Role
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const profile =
                    await getMyProfile();

                setRole(
                    profile.role
                );

            } catch (error) {

                console.error(
                    "Unable to load user role:",
                    error
                );

            }

        };


        loadProfile();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Candidate Menu
    |--------------------------------------------------------------------------
    */

    const candidateMenu = [

        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard",
        },

        {
            title: "Profile",
            icon: User,
            path: "/profile",
        },

        {
            title: "Resume AI",
            icon: FileText,
            path: "/ai/resume",
        },

        {
            title: "AI Recommendations",
            icon: Sparkles,
            path: "/ai/recommendations",
        },

        {
            title: "Interview AI",
            icon: BrainCircuit,
            path: "/ai/interview-questions",
        },

        {
            title: "My AI Matches",
            icon: Target,
            path: "/ai/matches",
        },

        {
            title: "Jobs",
            icon: Briefcase,
            path: "/jobs",
        },

        {
            title: "Applications",
            icon: ClipboardList,
            path: "/applications",
        },

        {
            title: "Companies",
            icon: Building2,
            path: "/companies",
        },

    ];


    /*
    |--------------------------------------------------------------------------
    | Recruiter Menu
    |--------------------------------------------------------------------------
    */

    const recruiterMenu = [

        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard",
        },

        {
            title: "Profile",
            icon: User,
            path: "/profile",
        },

        {
            title: "Jobs",
            icon: Briefcase,
            path: "/recruiter/jobs",
        },

        {
            title: "Applications",
            icon: Users,
            path: "/recruiter/applications",
        },

        {
            title: "Companies",
            icon: Building2,
            path: "/companies",
        },

    ];


    /*
    |--------------------------------------------------------------------------
    | Admin Menu
    |--------------------------------------------------------------------------
    */

    const adminMenu = [

        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard",
        },

        {
            title: "Profile",
            icon: User,
            path: "/profile",
        },

        {
            title: "User Management",
            icon: Users,
            path: "/admin/users",
        },

        {
            title: "Company Management",
            icon: Building2,
            path: "/admin/companies",
        },

        {
            title: "Job Management",
            icon: Briefcase,
            path: "/admin/jobs",
        },

        {
            title: "Application Management",
            icon: ClipboardList,
            path: "/admin/applications",
        },

    ];


    /*
    |--------------------------------------------------------------------------
    | Select Menu Based On Role
    |--------------------------------------------------------------------------
    */

    let menu = [];


    if (role === "candidate") {

        menu = candidateMenu;

    } else if (role === "recruiter") {

        menu = recruiterMenu;

    } else if (role === "admin") {

        menu = adminMenu;

    }


    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    const handleLogout = () => {

        localStorage.removeItem(
            "access"
        );

        localStorage.removeItem(
            "refresh"
        );

        navigate(
            "/login",
            {
                replace: true,
            }
        );

    };


    return (

        <aside className="hidden lg:flex flex-col w-72 h-screen bg-slate-900 text-white fixed left-0 top-0">

            {/* Logo */}

            <div className="h-20 border-b border-slate-800 flex items-center px-8">

                <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold">
                    AI
                </div>


                <div className="ml-4">

                    <h2 className="text-xl font-bold">
                        AI Job Portal
                    </h2>


                    <p className="text-sm text-slate-400">
                        Recruitment Platform
                    </p>

                </div>

            </div>


            {/* Navigation */}

            <nav className="flex-1 overflow-y-auto py-8 px-5">

                <p className="text-xs uppercase tracking-widest text-slate-500 px-4 mb-4">
                    Main Menu
                </p>


                {!role ? (

                    <div className="px-4 py-3">

                        <div className="h-4 bg-slate-800 rounded animate-pulse" />

                        <div className="h-4 bg-slate-800 rounded animate-pulse mt-4" />

                        <div className="h-4 bg-slate-800 rounded animate-pulse mt-4" />

                    </div>

                ) : (

                    <div className="space-y-2">

                        {menu.map(
                            (item) => {

                                const Icon =
                                    item.icon;


                                return (

                                    <NavLink
                                        key={
                                            item.path +
                                            item.title
                                        }
                                        to={
                                            item.path
                                        }
                                        className={({
                                            isActive,
                                        }) =>
                                            `flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 ${isActive
                                                ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                            }`
                                        }
                                    >

                                        <Icon
                                            size={20}
                                        />


                                        <span className="font-medium">
                                            {
                                                item.title
                                            }
                                        </span>

                                    </NavLink>

                                );

                            }
                        )}

                    </div>

                )}

            </nav>


            {/* Bottom */}

            <div className="border-t border-slate-800 p-5">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/profile"
                        )
                    }
                    className="flex items-center gap-4 w-full px-5 py-3 rounded-2xl hover:bg-slate-800 transition text-left"
                >

                    <Settings
                        size={20}
                    />

                    Settings

                </button>


                <button
                    type="button"
                    onClick={
                        handleLogout
                    }
                    className="mt-3 flex items-center gap-4 w-full px-5 py-3 rounded-2xl bg-red-500 hover:bg-red-600 transition"
                >

                    <LogOut
                        size={20}
                    />

                    Logout

                </button>

            </div>

        </aside>

    );

};


export default Sidebar;