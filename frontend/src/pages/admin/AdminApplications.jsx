import { useEffect, useMemo, useState } from "react";

import api from "../../api/axios";


const AdminApplications = () => {

    const [applications, setApplications] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [updatingId, setUpdatingId] =
        useState(null);

    const [updateError, setUpdateError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Applications
    |--------------------------------------------------------------------------
    */

    const loadApplications = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "applications/admin/"
                );

            setApplications(
                response.data
            );

        } catch (error) {

            console.error(
                "Unable to load admin applications:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to load applications."
            );

        } finally {

            setLoading(false);

        }
    };


    /*
    |--------------------------------------------------------------------------
    | Load On Mount
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadApplications();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Update Application Status
    |--------------------------------------------------------------------------
    */

    const updateApplicationStatus = async (
        applicationId,
        newStatus
    ) => {

        try {

            setUpdatingId(
                applicationId
            );

            setUpdateError("");


            const response =
                await api.patch(
                    `applications/${applicationId}/status/`,
                    {
                        status: newStatus,
                    }
                );


            setApplications(
                (previousApplications) =>
                    previousApplications.map(
                        (application) =>
                            application.id ===
                                applicationId
                                ? response.data
                                : application
                    )
            );

        } catch (error) {

            console.error(
                "Unable to update application status:",
                error
            );

            setUpdateError(
                error?.response?.data?.detail ||
                error?.response?.data?.status?.[0] ||
                "Unable to update application status."
            );

        } finally {

            setUpdatingId(null);

        }
    };


    /*
    |--------------------------------------------------------------------------
    | Status Style
    |--------------------------------------------------------------------------
    */

    const getStatusStyle = (status) => {

        switch (status) {

            case "applied":
                return "bg-blue-100 text-blue-700";

            case "shortlisted":
                return "bg-yellow-100 text-yellow-700";

            case "interview":
                return "bg-purple-100 text-purple-700";

            case "selected":
                return "bg-green-100 text-green-700";

            case "rejected":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Format Status
    |--------------------------------------------------------------------------
    */

    const formatStatus = (status) => {

        if (!status) {
            return "Unknown";
        }

        return status
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                (char) => char.toUpperCase()
            );
    };


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Filter Applications
    |--------------------------------------------------------------------------
    */

    const filteredApplications = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();


        return applications.filter(
            (application) => {

                const matchesSearch =
                    !searchValue ||
                    application.candidate_name
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    application.candidate_email
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    application.job_title
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    application.company_name
                        ?.toLowerCase()
                        .includes(searchValue);


                const matchesStatus =
                    statusFilter === "all" ||
                    application.status ===
                    statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );

    }, [
        applications,
        search,
        statusFilter,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Clear Filters
    |--------------------------------------------------------------------------
    */

    const clearFilters = () => {

        setSearch("");
        setStatusFilter("all");

    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

                    <p className="text-gray-500 mt-4">
                        Loading applications...
                    </p>

                </div>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (
            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="text-center bg-white rounded-3xl shadow-lg p-10 max-w-lg">

                    <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold">
                        !
                    </div>


                    <h1 className="text-2xl font-bold text-gray-900 mt-6">
                        Unable to load applications
                    </h1>


                    <p className="text-gray-500 mt-3">
                        {error}
                    </p>


                    <button
                        onClick={loadApplications}
                        className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

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
                            Applications
                        </h1>


                        <p className="text-indigo-100 mt-3 text-lg">
                            Monitor and manage all candidate applications.
                        </p>

                    </div>


                    <button
                        onClick={loadApplications}
                        className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 font-semibold transition"
                    >
                        ↻ Refresh
                    </button>

                </div>

            </div>


            {/* Update Error */}

            {updateError && (

                <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-5 py-4">
                    {updateError}
                </div>

            )}


            {/* Filters */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                <div className="flex flex-col lg:flex-row gap-4">

                    {/* Search */}

                    <div className="flex-1">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search Applications
                        </label>


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search candidate, email, job or company..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>


                    {/* Status Filter */}

                    <div className="w-full lg:w-64">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Status
                        </label>


                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        >

                            <option value="all">
                                All Statuses
                            </option>

                            <option value="applied">
                                Applied
                            </option>

                            <option value="shortlisted">
                                Shortlisted
                            </option>

                            <option value="interview">
                                Interview
                            </option>

                            <option value="selected">
                                Selected
                            </option>

                            <option value="rejected">
                                Rejected
                            </option>

                        </select>

                    </div>


                    {/* Clear */}

                    <div className="flex items-end">

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="w-full lg:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition"
                        >
                            Clear Filters
                        </button>

                    </div>

                </div>

            </div>


            {/* Applications Table */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="px-8 py-6 border-b border-gray-100">

                    <h2 className="text-2xl font-bold text-gray-900">
                        All Applications
                    </h2>


                    <p className="text-gray-500 mt-1">
                        Showing{" "}
                        {filteredApplications.length}{" "}
                        of{" "}
                        {applications.length}{" "}
                        applications
                    </p>

                </div>


                {filteredApplications.length === 0 ? (

                    <div className="px-8 py-16 text-center">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
                            🔍
                        </div>


                        <h3 className="text-xl font-semibold text-gray-900 mt-5">
                            No matching applications
                        </h3>


                        <p className="text-gray-500 mt-2">
                            Try changing your search or filter.
                        </p>


                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="bg-gray-50 border-b border-gray-100">

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        ID
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Candidate
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Job
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Company
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Current Status
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Change Status
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Applied
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Resume
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredApplications.map(
                                    (application) => (

                                        <tr
                                            key={
                                                application.id
                                            }
                                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                                        >

                                            {/* ID */}

                                            <td className="px-6 py-5 text-gray-600">
                                                {
                                                    application.id
                                                }
                                            </td>


                                            {/* Candidate */}

                                            <td className="px-6 py-5">

                                                <p className="font-semibold text-gray-900">
                                                    {
                                                        application.candidate_name ||
                                                        "—"
                                                    }
                                                </p>


                                                <p className="text-sm text-gray-500 mt-1">
                                                    {
                                                        application.candidate_email ||
                                                        "—"
                                                    }
                                                </p>

                                            </td>


                                            {/* Job */}

                                            <td className="px-6 py-5">

                                                <p className="font-semibold text-gray-900">
                                                    {
                                                        application.job_title ||
                                                        "—"
                                                    }
                                                </p>

                                            </td>


                                            {/* Company */}

                                            <td className="px-6 py-5 text-gray-700 font-medium">
                                                {
                                                    application.company_name ||
                                                    "—"
                                                }
                                            </td>


                                            {/* Current Status */}

                                            <td className="px-6 py-5">

                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                                                        application.status
                                                    )}`}
                                                >
                                                    {
                                                        formatStatus(
                                                            application.status
                                                        )
                                                    }
                                                </span>

                                            </td>


                                            {/* Change Status */}

                                            <td className="px-6 py-5">

                                                <select
                                                    value={
                                                        application.status
                                                    }
                                                    disabled={
                                                        updatingId ===
                                                        application.id
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateApplicationStatus(
                                                            application.id,
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                >

                                                    <option value="applied">
                                                        Applied
                                                    </option>

                                                    <option value="shortlisted">
                                                        Shortlisted
                                                    </option>

                                                    <option value="interview">
                                                        Interview
                                                    </option>

                                                    <option value="selected">
                                                        Selected
                                                    </option>

                                                    <option value="rejected">
                                                        Rejected
                                                    </option>

                                                </select>


                                                {updatingId ===
                                                    application.id && (

                                                        <p className="text-xs text-indigo-600 mt-2">
                                                            Updating...
                                                        </p>

                                                    )}

                                            </td>


                                            {/* Date */}

                                            <td className="px-6 py-5 text-gray-600 whitespace-nowrap">
                                                {
                                                    formatDate(
                                                        application.created_at
                                                    )
                                                }
                                            </td>


                                            {/* Resume */}

                                            <td className="px-6 py-5">

                                                {application.resume ? (

                                                    <a
                                                        href={
                                                            application.resume
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium text-sm transition"
                                                    >
                                                        View Resume
                                                    </a>

                                                ) : (

                                                    <span className="text-gray-400 text-sm">
                                                        No resume
                                                    </span>

                                                )}

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};


export default AdminApplications;