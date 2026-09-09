import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";


const AdminDashboard = () => {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        users: 0,
        candidates: 0,
        recruiters: 0,
        companies: 0,
        jobs: 0,
        activeJobs: 0,
        applications: 0,
    });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadStats = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "auth/admin-dashboard-stats/"
                );

            setStats({
                users:
                    response.data.users ?? 0,

                candidates:
                    response.data.candidates ?? 0,

                recruiters:
                    response.data.recruiters ?? 0,

                companies:
                    response.data.companies ?? 0,

                jobs:
                    response.data.jobs ?? 0,

                activeJobs:
                    response.data.active_jobs ?? 0,

                applications:
                    response.data.applications ?? 0,
            });

        } catch (error) {

            console.error(
                "Unable to load admin dashboard:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to load admin dashboard."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadStats();

    }, []);


    if (loading) {

        return (
            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

                    <p className="text-gray-500 mt-4">
                        Loading admin dashboard...
                    </p>

                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="text-center bg-white rounded-3xl shadow-lg p-10 max-w-lg">

                    <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold">
                        !
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mt-6">
                        Unable to load dashboard
                    </h1>

                    <p className="text-gray-500 mt-3">
                        {error}
                    </p>

                    <button
                        onClick={loadStats}
                        className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    const cards = [
        {
            title: "Total Users",
            value: stats.users,
            icon: "👥",
        },
        {
            title: "Candidates",
            value: stats.candidates,
            icon: "🎓",
        },
        {
            title: "Recruiters",
            value: stats.recruiters,
            icon: "💼",
        },
        {
            title: "Companies",
            value: stats.companies,
            icon: "🏢",
        },
        {
            title: "Total Jobs",
            value: stats.jobs,
            icon: "📋",
        },
        {
            title: "Active Jobs",
            value: stats.activeJobs,
            icon: "✅",
        },
        {
            title: "Applications",
            value: stats.applications,
            icon: "📨",
        },
    ];


    return (
        <div className="space-y-8">

            {/* Header */}

            <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-lg p-8 text-white">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    <div>

                        <p className="text-indigo-100 uppercase tracking-wider text-sm font-semibold">
                            Administration
                        </p>

                        <h1 className="text-4xl font-bold mt-2">
                            Admin Dashboard
                        </h1>

                        <p className="text-indigo-100 mt-3 text-lg">
                            Manage and monitor your AI Job Portal.
                        </p>

                    </div>

                    <button
                        onClick={loadStats}
                        className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 font-semibold transition"
                    >
                        ↻ Refresh
                    </button>

                </div>

            </div>


            {/* Statistics */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

                {cards.map((card) => (

                    <div
                        key={card.title}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm">
                                    {card.title}
                                </p>

                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {card.value}
                                </p>

                            </div>

                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
                                {card.icon}
                            </div>

                        </div>

                    </div>

                ))}

            </div>


            {/* Management */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                <h2 className="text-2xl font-bold text-gray-900">
                    Administration
                </h2>

                <p className="text-gray-500 mt-2">
                    Manage the main resources of the job portal.
                </p>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">

                    <button
                        type="button"
                        onClick={() => navigate("/admin/users")}
                        className="text-left border border-gray-200 rounded-xl p-5 hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer"
                    >

                        <h3 className="font-semibold text-gray-900">
                            Users
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                            Manage candidates and recruiters.
                        </p>

                        <p className="text-indigo-600 text-sm font-semibold mt-4">
                            Manage Users →
                        </p>

                    </button>


                    <div className="border border-gray-200 rounded-xl p-5">

                        <h3 className="font-semibold text-gray-900">
                            Companies
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                            Manage registered companies.
                        </p>

                    </div>


                    <div className="border border-gray-200 rounded-xl p-5">

                        <h3 className="font-semibold text-gray-900">
                            Jobs
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                            Monitor jobs posted on the platform.
                        </p>

                    </div>


                    <div className="border border-gray-200 rounded-xl p-5">

                        <h3 className="font-semibold text-gray-900">
                            Applications
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                            Monitor candidate applications.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default AdminDashboard;