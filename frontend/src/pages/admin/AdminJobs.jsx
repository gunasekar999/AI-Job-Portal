import { useEffect, useMemo, useState } from "react";

import {
    Search,
    RefreshCw,
    Trash2,
    Power,
    X,
} from "lucide-react";

import api from "../../api/axios";


const AdminJobs = () => {

    const [jobs, setJobs] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [jobTypeFilter, setJobTypeFilter] =
        useState("all");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [actionLoading, setActionLoading] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Load Jobs
    |--------------------------------------------------------------------------
    */

    const loadJobs = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "jobs/admin/"
                );

            setJobs(
                response.data
            );

        } catch (error) {

            console.error(
                "Unable to load admin jobs:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to load jobs."
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

        loadJobs();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Filter Jobs
    |--------------------------------------------------------------------------
    */

    const filteredJobs = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();

        return jobs.filter((job) => {

            const matchesSearch =
                !searchValue ||
                job.title
                    ?.toLowerCase()
                    .includes(searchValue) ||
                job.company_name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                job.recruiter_name
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesJobType =
                jobTypeFilter === "all" ||
                job.job_type === jobTypeFilter;

            const matchesStatus =
                statusFilter === "all" ||
                (
                    statusFilter === "active" &&
                    job.is_active
                ) ||
                (
                    statusFilter === "inactive" &&
                    !job.is_active
                );

            return (
                matchesSearch &&
                matchesJobType &&
                matchesStatus
            );

        });

    }, [
        jobs,
        search,
        jobTypeFilter,
        statusFilter,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Clear Filters
    |--------------------------------------------------------------------------
    */

    const clearFilters = () => {

        setSearch("");
        setJobTypeFilter("all");
        setStatusFilter("all");

    };


    /*
    |--------------------------------------------------------------------------
    | Toggle Job Status
    |--------------------------------------------------------------------------
    */

    const toggleJobStatus = async (job) => {

        try {

            setActionLoading(
                `status-${job.id}`
            );

            const response =
                await api.patch(
                    `jobs/${job.id}/`,
                    {
                        is_active:
                            !job.is_active,
                    }
                );

            setJobs((currentJobs) =>
                currentJobs.map(
                    (currentJob) =>
                        currentJob.id === job.id
                            ? response.data
                            : currentJob
                )
            );

        } catch (error) {

            console.error(
                "Unable to update job status:",
                error
            );

            alert(
                error?.response?.data?.detail ||
                "Unable to update job status."
            );

        } finally {

            setActionLoading(null);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Delete Job
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (job) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${job.title}"?`
            );

        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(
                `delete-${job.id}`
            );

            await api.delete(
                `jobs/${job.id}/`
            );

            setJobs((currentJobs) =>
                currentJobs.filter(
                    (currentJob) =>
                        currentJob.id !== job.id
                )
            );

        } catch (error) {

            console.error(
                "Unable to delete job:",
                error
            );

            alert(
                error?.response?.data?.detail ||
                "Unable to delete job."
            );

        } finally {

            setActionLoading(null);

        }

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
                        Loading jobs...
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
                        Unable to load jobs
                    </h1>

                    <p className="text-gray-500 mt-3">
                        {error}
                    </p>

                    <button
                        onClick={loadJobs}
                        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                    >
                        <RefreshCw size={18} />
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
                            Job Management
                        </h1>

                        <p className="text-indigo-100 mt-3 text-lg">
                            Monitor and manage all jobs posted on the platform.
                        </p>

                    </div>


                    <button
                        onClick={loadJobs}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 font-semibold transition"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>

                </div>

            </div>


            {/* Filters */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                <div className="flex flex-col lg:flex-row gap-4">

                    {/* Search */}

                    <div className="relative flex-1">

                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search job title, company or recruiter..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />

                    </div>


                    {/* Job Type */}

                    <select
                        value={jobTypeFilter}
                        onChange={(event) =>
                            setJobTypeFilter(
                                event.target.value
                            )
                        }
                        className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >

                        <option value="all">
                            All Job Types
                        </option>

                        <option value="Full Time">
                            Full Time
                        </option>

                        <option value="Part Time">
                            Part Time
                        </option>

                        <option value="Internship">
                            Internship
                        </option>

                        <option value="Remote">
                            Remote
                        </option>

                    </select>


                    {/* Status */}

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                        className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >

                        <option value="all">
                            All Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                    </select>


                    {/* Clear */}

                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold transition"
                    >
                        <X size={18} />
                        Clear
                    </button>

                </div>

            </div>


            {/* Jobs */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="px-8 py-6 border-b border-gray-100">

                    <h2 className="text-2xl font-bold text-gray-900">
                        All Jobs
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Showing {filteredJobs.length} of{" "}
                        {jobs.length} jobs
                    </p>

                </div>


                {filteredJobs.length === 0 ? (

                    <div className="px-8 py-16 text-center">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
                            💼
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mt-5">
                            No jobs found
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Try changing your search or filters.
                        </p>

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
                                        Job
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Company
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Recruiter
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Location
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Type
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Experience
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Status
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredJobs.map(
                                    (job) => (

                                        <tr
                                            key={job.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                                        >

                                            {/* ID */}

                                            <td className="px-6 py-5 text-gray-600">
                                                {job.id}
                                            </td>


                                            {/* Job */}

                                            <td className="px-6 py-5">

                                                <div>

                                                    <p className="font-semibold text-gray-900">
                                                        {job.title}
                                                    </p>

                                                    <p className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                                                        {job.description ||
                                                            "No description"}
                                                    </p>

                                                </div>

                                            </td>


                                            {/* Company */}

                                            <td className="px-6 py-5 text-gray-700 font-medium">
                                                {job.company_name ||
                                                    "—"}
                                            </td>


                                            {/* Recruiter */}

                                            <td className="px-6 py-5 text-gray-600">
                                                {job.recruiter_name ||
                                                    "—"}
                                            </td>


                                            {/* Location */}

                                            <td className="px-6 py-5 text-gray-600">
                                                {job.location ||
                                                    "—"}
                                            </td>


                                            {/* Type */}

                                            <td className="px-6 py-5 text-gray-600">
                                                {job.job_type ||
                                                    "—"}
                                            </td>


                                            {/* Experience */}

                                            <td className="px-6 py-5 text-gray-600">
                                                {job.experience ||
                                                    "—"}
                                            </td>


                                            {/* Status */}

                                            <td className="px-6 py-5">

                                                {job.is_active ? (

                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                                        Active
                                                    </span>

                                                ) : (

                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                                                        Inactive
                                                    </span>

                                                )}

                                            </td>


                                            {/* Actions */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleJobStatus(
                                                                job
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading ===
                                                            `status-${job.id}`
                                                        }
                                                        title={
                                                            job.is_active
                                                                ? "Deactivate job"
                                                                : "Activate job"
                                                        }
                                                        className={`inline-flex items-center justify-center w-10 h-10 rounded-xl transition ${job.is_active
                                                                ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                                                                : "bg-green-50 text-green-600 hover:bg-green-100"
                                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    >

                                                        {actionLoading ===
                                                            `status-${job.id}` ? (

                                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />

                                                        ) : (

                                                            <Power
                                                                size={18}
                                                            />

                                                        )}

                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                job
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading ===
                                                            `delete-${job.id}`
                                                        }
                                                        title="Delete job"
                                                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >

                                                        {actionLoading ===
                                                            `delete-${job.id}` ? (

                                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />

                                                        ) : (

                                                            <Trash2
                                                                size={18}
                                                            />

                                                        )}

                                                    </button>

                                                </div>

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


export default AdminJobs;