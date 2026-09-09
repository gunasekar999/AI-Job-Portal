import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Briefcase,
    CheckCircle2,
    ClipboardList,
    Users,
    Plus,
    ArrowUpRight,
    CalendarDays,
    Building2,
    RefreshCw,
} from "lucide-react";

import {
    getRecruiterJobs,
} from "../../services/jobService";

import {
    getRecruiterApplications,
} from "../../services/applicationService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";


const RecruiterDashboard = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] =
        useState([]);

    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Recruiter Dashboard
    |--------------------------------------------------------------------------
    */

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");


            const [
                jobsResult,
                applicationsResult,
            ] = await Promise.all([
                getRecruiterJobs(),
                getRecruiterApplications(),
            ]);


            const jobsData =
                Array.isArray(jobsResult)
                    ? jobsResult
                    : jobsResult.results || [];


            const applicationsData =
                Array.isArray(
                    applicationsResult
                )
                    ? applicationsResult
                    : applicationsResult.results || [];


            setJobs(jobsData);
            setApplications(
                applicationsData
            );

        } catch (error) {
            console.error(
                "Unable to load recruiter dashboard:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to load recruiter dashboard. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadDashboard();
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const totalJobs =
        jobs.length;


    const activeJobs =
        jobs.filter(
            (job) =>
                job.is_active
        ).length;


    const totalApplications =
        applications.length;


    const shortlistedCandidates =
        applications.filter(
            (application) =>
                application.status ===
                "shortlisted"
        ).length;


    const recentApplications =
        applications.slice(
            0,
            5
        );


    const recentJobs =
        jobs.slice(
            0,
            4
        );


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <LoadingSpinner
                text="Loading recruiter dashboard..."
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {
        return (
            <ErrorMessage
                message={error}
                onRetry={loadDashboard}
            />
        );
    }


    return (
        <div className="space-y-8">

            {/* Welcome */}

            <div className="rounded-3xl bg-linear-to-r from-blue-700 via-indigo-600 to-purple-600 text-white p-10 shadow-xl">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    <div>

                        <p className="text-blue-200 font-semibold uppercase tracking-wider text-sm">
                            Recruiter Portal
                        </p>


                        <h1 className="text-4xl font-bold mt-2">
                            Recruiter Dashboard
                        </h1>


                        <p className="mt-3 text-blue-100 text-lg">
                            Manage your jobs and applications from one place.
                        </p>

                    </div>


                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={
                                loadDashboard
                            }
                            className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-3 rounded-xl font-semibold hover:bg-white/20 transition"
                        >

                            <RefreshCw
                                size={19}
                            />

                            Refresh

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/recruiter/jobs"
                                )
                            }
                            className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
                        >

                            <Plus
                                size={20}
                            />

                            Post New Job

                        </button>

                    </div>

                </div>

            </div>


            {/* Statistics */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <StatCard
                    title="Total Jobs"
                    value={
                        totalJobs
                    }
                    icon={
                        Briefcase
                    }
                    iconClass="bg-blue-100 text-blue-600"
                />


                <StatCard
                    title="Active Jobs"
                    value={
                        activeJobs
                    }
                    icon={
                        CheckCircle2
                    }
                    iconClass="bg-green-100 text-green-600"
                />


                <StatCard
                    title="Applications"
                    value={
                        totalApplications
                    }
                    icon={
                        ClipboardList
                    }
                    iconClass="bg-purple-100 text-purple-600"
                />


                <StatCard
                    title="Shortlisted"
                    value={
                        shortlistedCandidates
                    }
                    icon={
                        Users
                    }
                    iconClass="bg-orange-100 text-orange-600"
                />

            </div>


            {/* Quick Actions */}

            <div className="grid md:grid-cols-2 gap-6">

                <QuickAction
                    icon={
                        Briefcase
                    }
                    title="Manage Jobs"
                    description="Create, edit, publish or close your job postings."
                    onClick={() =>
                        navigate(
                            "/recruiter/jobs"
                        )
                    }
                />


                <QuickAction
                    icon={
                        Users
                    }
                    title="Review Applications"
                    description="View candidates and update application statuses."
                    onClick={() =>
                        navigate(
                            "/recruiter/applications"
                        )
                    }
                />

            </div>


            {/* Recent Applications */}

            <div className="bg-white rounded-3xl shadow-lg p-8">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <div>

                        <div className="flex items-center gap-3">

                            <ClipboardList
                                className="text-blue-600"
                                size={25}
                            />

                            <h2 className="text-2xl font-bold">
                                Recent Applications
                            </h2>

                        </div>


                        <p className="text-gray-500 mt-2">
                            Latest candidates who applied to your jobs.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/recruiter/applications"
                            )
                        }
                        className="text-blue-600 font-semibold flex items-center gap-2"
                    >

                        View All

                        <ArrowUpRight
                            size={18}
                        />

                    </button>

                </div>


                {recentApplications.length ===
                    0 ? (

                    <EmptyState
                        title="No Applications Yet"
                        message="Applications will appear here when candidates apply to your jobs."
                    />

                ) : (

                    <div className="space-y-4">

                        {recentApplications.map(
                            (
                                application
                            ) => (

                                <div
                                    key={
                                        application.id
                                    }
                                    className="border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-blue-100 transition"
                                >

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                                        <div className="min-w-0">

                                            <h3 className="text-lg font-bold text-gray-900">

                                                {
                                                    application.candidate_name ||
                                                    "Candidate"
                                                }

                                            </h3>


                                            <p className="text-gray-500 mt-1">

                                                {
                                                    application.candidate_email ||
                                                    "Email unavailable"
                                                }

                                            </p>


                                            <div className="flex flex-wrap gap-5 mt-3 text-sm text-gray-500">

                                                <span className="flex items-center gap-2">

                                                    <Briefcase
                                                        size={16}
                                                    />

                                                    {
                                                        application.job_title ||
                                                        "Job"
                                                    }

                                                </span>


                                                <span className="flex items-center gap-2">

                                                    <Building2
                                                        size={16}
                                                    />

                                                    {
                                                        application.company_name ||
                                                        "Company"
                                                    }

                                                </span>


                                                {application.created_at && (

                                                    <span className="flex items-center gap-2">

                                                        <CalendarDays
                                                            size={16}
                                                        />

                                                        {formatDate(
                                                            application.created_at
                                                        )}

                                                    </span>

                                                )}

                                            </div>

                                        </div>


                                        <span
                                            className={`px-4 py-2 rounded-full text-sm font-bold self-start md:self-center ${getStatusClass(
                                                application.status
                                            )}`}
                                        >

                                            {formatStatus(
                                                application.status
                                            )}

                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* Job Overview */}

            <div className="bg-white rounded-3xl shadow-lg p-8">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <div>

                        <div className="flex items-center gap-3">

                            <Briefcase
                                className="text-indigo-600"
                                size={25}
                            />

                            <h2 className="text-2xl font-bold">
                                Your Jobs
                            </h2>

                        </div>


                        <p className="text-gray-500 mt-2">
                            Overview of your latest job postings.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/recruiter/jobs"
                            )
                        }
                        className="text-blue-600 font-semibold flex items-center gap-2"
                    >

                        Manage Jobs

                        <ArrowUpRight
                            size={18}
                        />

                    </button>

                </div>


                {jobs.length === 0 ? (

                    <EmptyState
                        title="No Jobs Posted Yet"
                        message="Create your first job posting to start receiving applications."
                    />

                ) : (

                    <div className="grid lg:grid-cols-2 gap-5">

                        {recentJobs.map(
                            (job) => (

                                <button
                                    type="button"
                                    key={
                                        job.id
                                    }
                                    onClick={() =>
                                        navigate(
                                            "/recruiter/jobs"
                                        )
                                    }
                                    className="border border-gray-100 rounded-2xl p-5 text-left hover:shadow-md hover:border-blue-100 transition"
                                >

                                    <div className="flex items-start justify-between gap-4">

                                        <div className="min-w-0">

                                            <h3 className="font-bold text-lg truncate">
                                                {
                                                    job.title
                                                }
                                            </h3>


                                            <p className="text-gray-500 mt-1">

                                                {
                                                    job.company_name ||
                                                    job.company?.company_name ||
                                                    "Company"
                                                }

                                            </p>

                                        </div>


                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${job.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >

                                            {job.is_active
                                                ? "Active"
                                                : "Closed"}

                                        </span>

                                    </div>


                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">

                                        <CalendarDays
                                            size={16}
                                        />

                                        Deadline:{" "}

                                        {formatDate(
                                            job.deadline
                                        )}

                                    </div>

                                </button>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Statistics Card
|--------------------------------------------------------------------------
*/

const StatCard = ({
    title,
    value,
    icon: Icon,
    iconClass,
}) => (

    <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition">

        <div className="flex items-center justify-between">

            <div>

                <p className="text-gray-500">
                    {title}
                </p>


                <p className="text-4xl font-bold mt-2">
                    {value}
                </p>

            </div>


            <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconClass}`}
            >

                <Icon
                    size={25}
                />

            </div>

        </div>

    </div>
);


/*
|--------------------------------------------------------------------------
| Quick Action
|--------------------------------------------------------------------------
*/

const QuickAction = ({
    icon: Icon,
    title,
    description,
    onClick,
}) => (

    <button
        type="button"
        onClick={onClick}
        className="bg-white rounded-3xl shadow-lg p-7 text-left hover:shadow-xl hover:-translate-y-0.5 transition"
    >

        <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

            <Icon
                size={26}
            />

        </div>


        <h3 className="text-xl font-bold mt-5">
            {title}
        </h3>


        <p className="text-gray-500 mt-2 leading-6">
            {description}
        </p>

    </button>
);


/*
|--------------------------------------------------------------------------
| Format Status
|--------------------------------------------------------------------------
*/

const formatStatus = (
    status
) => {

    if (!status) {
        return "Applied";
    }


    return (
        status.charAt(0).toUpperCase() +
        status.slice(1)
    );
};


/*
|--------------------------------------------------------------------------
| Status Style
|--------------------------------------------------------------------------
*/

const getStatusClass = (
    status
) => {

    const styles = {

        applied:
            "bg-yellow-100 text-yellow-700",

        reviewing:
            "bg-blue-100 text-blue-700",

        shortlisted:
            "bg-green-100 text-green-700",

        interview:
            "bg-purple-100 text-purple-700",

        selected:
            "bg-emerald-100 text-emerald-700",

        rejected:
            "bg-red-100 text-red-700",

    };


    return (
        styles[status] ||
        "bg-gray-100 text-gray-600"
    );
};


/*
|--------------------------------------------------------------------------
| Format Date
|--------------------------------------------------------------------------
*/

const formatDate = (
    date
) => {

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


export default RecruiterDashboard;