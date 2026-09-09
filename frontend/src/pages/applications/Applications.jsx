import { useEffect, useMemo, useState } from "react";

import {
    Briefcase,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    Search,
    XCircle,
    Undo2,
    Loader2,
} from "lucide-react";

import {
    getMyApplications,
    withdrawApplication,
} from "../../services/applicationService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";


const APPLICATION_STATUSES = [
    {
        value: "applied",
        label: "Applied",
    },
    {
        value: "reviewing",
        label: "Reviewing",
    },
    {
        value: "shortlisted",
        label: "Shortlisted",
    },
    {
        value: "interview",
        label: "Interview",
    },
    {
        value: "selected",
        label: "Selected",
    },
    {
        value: "rejected",
        label: "Rejected",
    },
];


const Applications = () => {

    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    const [withdrawingId, setWithdrawingId] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Load Applications
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadApplications();
    }, []);


    const loadApplications = async () => {

        try {
            setLoading(true);
            setError("");

            const data =
                await getMyApplications();

            const results =
                Array.isArray(data)
                    ? data
                    : data?.results || [];

            setApplications(
                results
            );

        } catch (err) {

            console.error(
                "Failed to load applications:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                "Unable to load applications. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Withdraw Application
    |--------------------------------------------------------------------------
    */

    const handleWithdraw = async (
        application
    ) => {

        const jobTitle =
            application.job_title ||
            application.job?.title ||
            "this job";


        const confirmed =
            window.confirm(
                `Are you sure you want to withdraw your application for "${jobTitle}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            setWithdrawingId(
                application.id
            );

            setError("");
            setSuccess("");


            await withdrawApplication(
                application.id
            );


            setApplications(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item.id !==
                            application.id
                    )
            );


            setSuccess(
                "Application withdrawn successfully."
            );

        } catch (err) {

            console.error(
                "Failed to withdraw application:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                "Unable to withdraw application. Please try again."
            );

        } finally {

            setWithdrawingId(
                null
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Filter Applications
    |--------------------------------------------------------------------------
    */

    const filteredApplications =
        useMemo(() => {

            return applications.filter(
                (application) => {

                    const jobTitle =
                        application.job_title ||
                        application.job?.title ||
                        "";

                    const companyName =
                        application.company_name ||
                        application.job?.company?.company_name ||
                        "";

                    const keyword =
                        search
                            .toLowerCase()
                            .trim();


                    const matchesSearch =
                        !keyword ||
                        jobTitle
                            .toLowerCase()
                            .includes(
                                keyword
                            ) ||
                        companyName
                            .toLowerCase()
                            .includes(
                                keyword
                            );


                    const matchesStatus =
                        !statusFilter ||
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
    | Statistics
    |--------------------------------------------------------------------------
    */

    const totalApplications =
        applications.length;


    const appliedApplications =
        applications.filter(
            (application) =>
                application.status ===
                "applied"
        ).length;


    const reviewingApplications =
        applications.filter(
            (application) =>
                application.status ===
                "reviewing"
        ).length;


    const shortlistedApplications =
        applications.filter(
            (application) =>
                application.status ===
                "shortlisted"
        ).length;


    const rejectedApplications =
        applications.filter(
            (application) =>
                application.status ===
                "rejected"
        ).length;


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <LoadingSpinner
                text="Loading your applications..."
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error && applications.length === 0) {
        return (
            <ErrorMessage
                message={error}
                onRetry={loadApplications}
            />
        );
    }


    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}

            <div>

                <h1 className="text-4xl font-bold text-gray-900">
                    My Applications
                </h1>

                <p className="text-gray-500 mt-2">
                    Track and manage all your job applications.
                </p>

            </div>


            {/* Success */}

            {success && (

                <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl font-medium">
                    {success}
                </div>

            )}


            {/* Error */}

            {error && applications.length > 0 && (

                <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl font-medium">
                    {error}
                </div>

            )}


            {/* Statistics */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <StatCard
                    title="Total Applications"
                    value={
                        totalApplications
                    }
                    icon={
                        <FileText
                            size={24}
                        />
                    }
                    iconClass="bg-blue-100 text-blue-600"
                />


                <StatCard
                    title="Applied"
                    value={
                        appliedApplications
                    }
                    icon={
                        <Clock3
                            size={24}
                        />
                    }
                    iconClass="bg-yellow-100 text-yellow-600"
                />


                <StatCard
                    title="Shortlisted"
                    value={
                        shortlistedApplications
                    }
                    icon={
                        <CheckCircle2
                            size={24}
                        />
                    }
                    iconClass="bg-green-100 text-green-600"
                />


                <StatCard
                    title="Rejected"
                    value={
                        rejectedApplications
                    }
                    icon={
                        <XCircle
                            size={24}
                        />
                    }
                    iconClass="bg-red-100 text-red-600"
                />

            </div>


            {/* Search / Filter */}

            <div className="bg-white rounded-3xl shadow-lg p-6">

                <div className="grid md:grid-cols-2 gap-4">

                    {/* Search */}

                    <div className="relative">

                        <Search
                            size={20}
                            className="absolute left-4 top-4 text-gray-400"
                        />

                        <input
                            type="text"
                            value={
                                search
                            }
                            onChange={(
                                event
                            ) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search by job or company..."
                            className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Status Filter */}

                    <select
                        value={
                            statusFilter
                        }
                        onChange={(
                            event
                        ) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                        className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="">
                            All Statuses
                        </option>


                        {APPLICATION_STATUSES.map(
                            (status) => (

                                <option
                                    key={
                                        status.value
                                    }
                                    value={
                                        status.value
                                    }
                                >
                                    {status.label}
                                </option>

                            )
                        )}

                    </select>

                </div>

            </div>


            {/* Applications */}

            {filteredApplications.length ===
                0 ? (

                <div className="bg-white rounded-3xl shadow-lg">

                    <EmptyState
                        title={
                            applications.length ===
                                0
                                ? "No Applications Yet"
                                : "No Applications Found"
                        }
                        message={
                            applications.length ===
                                0
                                ? "Your job applications will appear here after you apply for a job."
                                : "Try changing your search or status filter."
                        }
                    />

                </div>

            ) : (

                <div className="space-y-5">

                    {filteredApplications.map(
                        (
                            application
                        ) => {

                            const jobTitle =
                                application.job_title ||
                                application.job?.title ||
                                "Job";


                            const companyName =
                                application.company_name ||
                                application.job?.company?.company_name ||
                                "Company";


                            return (
                                <ApplicationCard
                                    key={
                                        application.id
                                    }
                                    application={
                                        application
                                    }
                                    jobTitle={
                                        jobTitle
                                    }
                                    companyName={
                                        companyName
                                    }
                                    withdrawingId={
                                        withdrawingId
                                    }
                                    onWithdraw={
                                        handleWithdraw
                                    }
                                />
                            );
                        }
                    )}

                </div>

            )}

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
    icon,
    iconClass,
}) => (

    <div className="bg-white rounded-3xl shadow-lg p-6">

        <div className="flex items-center justify-between">

            <div>

                <p className="text-gray-500">
                    {title}
                </p>

                <h2 className="text-4xl font-bold mt-2">
                    {value}
                </h2>

            </div>


            <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconClass}`}
            >
                {icon}
            </div>

        </div>

    </div>
);


/*
|--------------------------------------------------------------------------
| Application Card
|--------------------------------------------------------------------------
*/

const ApplicationCard = ({
    application,
    jobTitle,
    companyName,
    withdrawingId,
    onWithdraw,
}) => {

    const status =
        application.status ||
        "applied";


    const canWithdraw =
        status === "applied" ||
        status === "reviewing" ||
        status === "shortlisted" ||
        status === "interview";


    const isWithdrawing =
        withdrawingId ===
        application.id;


    return (
        <article className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition p-7">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div className="flex items-start gap-5">

                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">

                        <Briefcase
                            size={27}
                        />

                    </div>


                    <div>

                        <h2 className="text-xl font-bold text-gray-900">
                            {jobTitle}
                        </h2>


                        <div className="flex flex-wrap gap-5 mt-2 text-gray-500">

                            <span className="flex items-center gap-2">

                                <Building2
                                    size={17}
                                />

                                {companyName}

                            </span>


                            {application.created_at && (

                                <span className="flex items-center gap-2">

                                    <CalendarDays
                                        size={17}
                                    />

                                    Applied{" "}

                                    {formatDate(
                                        application.created_at
                                    )}

                                </span>

                            )}

                        </div>

                    </div>

                </div>


                <div className="flex items-center gap-4 flex-wrap">

                    <StatusBadge
                        status={
                            status
                        }
                    />


                    {canWithdraw && (

                        <button
                            type="button"
                            onClick={() =>
                                onWithdraw(
                                    application
                                )
                            }
                            disabled={
                                isWithdrawing
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                            {isWithdrawing ? (

                                <>

                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />

                                    Withdrawing...

                                </>

                            ) : (

                                <>

                                    <Undo2
                                        size={17}
                                    />

                                    Withdraw

                                </>

                            )}

                        </button>

                    )}

                </div>

            </div>


            {application.cover_letter && (

                <div className="mt-6 bg-slate-50 rounded-2xl p-5">

                    <p className="text-sm font-semibold text-gray-700 mb-2">
                        Cover Letter
                    </p>

                    <p className="text-gray-600 line-clamp-3">
                        {application.cover_letter}
                    </p>

                </div>

            )}

        </article>
    );
};


/*
|--------------------------------------------------------------------------
| Status Badge
|--------------------------------------------------------------------------
*/

const StatusBadge = ({
    status,
}) => {

    const statusInfo = {

        applied: {
            label: "Applied",
            className:
                "bg-yellow-100 text-yellow-700",
            icon: (
                <Clock3
                    size={16}
                />
            ),
        },

        reviewing: {
            label: "Reviewing",
            className:
                "bg-blue-100 text-blue-700",
            icon: (
                <Search
                    size={16}
                />
            ),
        },

        shortlisted: {
            label: "Shortlisted",
            className:
                "bg-green-100 text-green-700",
            icon: (
                <CheckCircle2
                    size={16}
                />
            ),
        },

        interview: {
            label: "Interview",
            className:
                "bg-purple-100 text-purple-700",
            icon: (
                <CalendarDays
                    size={16}
                />
            ),
        },

        selected: {
            label: "Selected",
            className:
                "bg-emerald-100 text-emerald-700",
            icon: (
                <CheckCircle2
                    size={16}
                />
            ),
        },

        rejected: {
            label: "Rejected",
            className:
                "bg-red-100 text-red-700",
            icon: (
                <XCircle
                    size={16}
                />
            ),
        },
    };


    const current =
        statusInfo[status] || {
            label: status,
            className:
                "bg-gray-100 text-gray-600",
            icon: (
                <Clock3
                    size={16}
                />
            ),
        };


    return (
        <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${current.className}`}
        >

            {current.icon}

            {current.label}

        </span>
    );
};


/*
|--------------------------------------------------------------------------
| Date Formatter
|--------------------------------------------------------------------------
*/

const formatDate = (
    date
) => {

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


export default Applications;