import { useEffect, useState } from "react";

import {
    Bell,
    ChevronDown,
    Menu,
    Moon,
    Search,
    User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
    getMyProfile,
} from "../../services/profileServices";

import LoadingSpinner from "../common/LoadingSpinner";


const Topbar = () => {
    const navigate = useNavigate();

    const [profile, setProfile] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [showProfileMenu, setShowProfileMenu] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Load Profile
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data =
                    await getMyProfile();

                setProfile(data);

            } catch (error) {
                console.error(
                    "Unable to load topbar profile:",
                    error
                );
            }
        };


        loadProfile();
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const handleSearch = (event) => {
        event.preventDefault();

        const keyword =
            search.trim();

        if (!keyword) {
            return;
        }


        navigate(
            `/jobs?search=${encodeURIComponent(
                keyword
            )}`
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Profile
    |--------------------------------------------------------------------------
    */

    const username =
        profile?.username ||
        profile?.user?.username ||
        "User";


    const email =
        profile?.email ||
        profile?.user?.email ||
        "";


    const role =
        profile?.role ||
        "";


    const displayRole =
        role === "candidate"
            ? "Candidate"
            : role === "recruiter"
                ? "Recruiter"
                : role === "admin"
                    ? "Administrator"
                    : "User";


    const avatarName =
        encodeURIComponent(
            username
        );


    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">

            <div className="h-20 px-8 flex items-center justify-between">

                {/* Left */}

                <div className="flex items-center gap-4">

                    {/* Mobile Menu */}

                    <button
                        type="button"
                        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition"
                        onClick={() => {
                            /*
                            |--------------------------------------------------
                            | Mobile sidebar functionality can be connected
                            | when a mobile drawer state is added to
                            | DashboardLayout.
                            |--------------------------------------------------
                            */
                        }}
                        aria-label="Open navigation menu"
                    >

                        <Menu
                            size={22}
                        />

                    </button>


                    {/* Search */}

                    <form
                        onSubmit={
                            handleSearch
                        }
                        className="relative hidden md:block"
                    >

                        <Search
                            size={18}
                            className="absolute left-4 top-4 text-gray-400"
                        />


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search jobs, companies..."
                            className="w-96 pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />

                    </form>

                </div>


                {/* Right */}

                <div className="flex items-center gap-3">

                    {/* Theme */}

                    <button
                        type="button"
                        className="relative w-11 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
                        title="Theme"
                    >

                        <Moon
                            size={20}
                        />

                    </button>


                    {/* Notifications */}

                    <button
                        type="button"
                        className="relative w-11 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
                        title="Notifications"
                    >

                        <Bell
                            size={20}
                        />

                    </button>


                    {/* Profile */}

                    <div className="relative ml-2">

                        <button
                            type="button"
                            onClick={() =>
                                setShowProfileMenu(
                                    (current) =>
                                        !current
                                )
                            }
                            className="flex items-center gap-3 cursor-pointer"
                        >

                            {profile?.profile_image ? (

                                <img
                                    src={
                                        profile.profile_image
                                    }
                                    alt={
                                        username
                                    }
                                    className="w-12 h-12 rounded-full border-2 border-blue-600 object-cover"
                                />

                            ) : (

                                <img
                                    src={`https://ui-avatars.com/api/?name=${avatarName}&background=2563eb&color=fff`}
                                    alt={
                                        username
                                    }
                                    className="w-12 h-12 rounded-full border-2 border-blue-600"
                                />

                            )}


                            <div className="hidden md:block text-left">

                                <h3 className="font-semibold text-gray-800">
                                    {username}
                                </h3>


                                <p className="text-sm text-gray-500">
                                    {displayRole}
                                </p>

                            </div>


                            <ChevronDown
                                size={18}
                                className={`text-gray-500 transition-transform ${showProfileMenu
                                    ? "rotate-180"
                                    : ""
                                    }`}
                            />

                        </button>


                        {/* Profile Menu */}

                        {showProfileMenu && (

                            <div className="absolute right-0 top-16 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-3">

                                <div className="px-4 py-3 border-b border-gray-100">

                                    <p className="font-semibold text-gray-800">
                                        {username}
                                    </p>


                                    {email && (

                                        <p className="text-sm text-gray-500 truncate mt-1">
                                            {email}
                                        </p>

                                    )}

                                </div>


                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProfileMenu(
                                            false
                                        );

                                        navigate(
                                            "/profile"
                                        );
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
                                >

                                    <div className="flex items-center gap-3">

                                        <User
                                            size={18}
                                        />

                                        My Profile

                                    </div>

                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </header>
    );
};


export default Topbar;