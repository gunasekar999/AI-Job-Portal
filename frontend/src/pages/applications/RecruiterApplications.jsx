import { useEffect, useMemo, useState } from "react";

import {
    Briefcase,
    Building2,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    FileText,
    Loader2,
    Mail,
    Search,
    User,
} from "lucide-react";

import {
    getRecruiterApplications,
    updateApplicationStatus,
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


const RecruiterApplications = () => {

    console.log(
        "RECRUITER APPLICATIONS FILE IS RUNNING"
    );

    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    const [updatingId, setUpdatingId] =
        useState(null);

    const [error, setError] =
        useState("");

    const [actionError, setActionError] =
        useState("");

    const [success, setSuccess] =
        useState("");


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
                await getRecruiterApplications();

            const results =
                Array.isArray(data)
                    ? data
                    : data?.results || [];

            setApplications(
                results
            );

        } catch (error) {

            console.error(
                "Unable to load recruiter applications:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to load recruiter applications. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Search + Status Filtering
    |--------------------------------------------------------------------------
    */

    const filteredApplications =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();


            return applications.filter(
                (application) => {

                    const candidateName =
                        String(
                            application?.candidate_name ||
                            application?.candidate?.username ||
                            application?.user_name ||
                            application?.user?.username ||
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    const candidateEmail =
                        String(
                            application?.candidate_email ||
                            application?.candidate?.email ||
                            application?.user?.email ||
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    const jobTitle =
                        String(
                            application?.job_title ||
                            application?.job?.title ||
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    const companyName =
                        String(
                            application?.company_name ||
                            application?.job?.company?.company_name ||
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    /*
                    |--------------------------------------------------------------------------
                    | Search Match
                    |--------------------------------------------------------------------------
                    |
                    | Empty search = show everything.
                    |
                    | Otherwise at least ONE searchable field
                    | must contain the entered keyword.
                    |
                    */

                    const matchesSearch =
                        keyword === ""
                            ? true
                            : (
                                candidateName.includes(
                                    keyword
                                ) ||
                                candidateEmail.includes(
                                    keyword
                                ) ||
                                jobTitle.includes(
                                    keyword
                                ) ||
                                companyName.includes(
                                    keyword
                                )
                            );


                    /*
                    |--------------------------------------------------------------------------
                    | Status Match
                    |--------------------------------------------------------------------------
                    */

                    const matchesStatus =
                        statusFilter === ""
                            ? true
                            : application?.status ===
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
    | Update Application Status
    |--------------------------------------------------------------------------
    */

    const handleStatusChange = async (
        application,
        newStatus
    ) => {

        if (
            newStatus ===
            application.status
        ) {
            return;
        }


        try {

            setUpdatingId(
                application.id
            );

            setActionError("");
            setSuccess("");


            const updated =
                await updateApplicationStatus(
                    application.id,
                    newStatus
                );


            setApplications(
                (previous) =>
                    previous.map(
                        (item) =>
                            item.id ===
                                application.id
                                ? {
                                    ...item,
                                    ...updated,
                                }
                                : item
                    )
            );


            const statusLabel =
                APPLICATION_STATUSES.find(
                    (item) =>
                        item.value ===
                        newStatus
                )?.label ||
                newStatus;


            setSuccess(
                `Application status updated to ${statusLabel}.`
            );

        } catch (error) {

            console.error(
                "Unable to update application status:",
                error
            );


            setActionError(
                error?.response?.data?.detail ||
                error?.response?.data?.status?.[0] ||
                "Unable to update application status."
            );

        } finally {

            setUpdatingId(
                null
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <LoadingSpinner
                text="Loading candidate applications..."
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
                onRetry={loadApplications}
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const appliedCount =
        applications.filter(
            (item) =>
                item.status ===
                "applied"
        ).length;


    const reviewingCount =
        applications.filter(
            (item) =>
                item.status ===
                "reviewing"
        ).length;


    const shortlistedCount =
        applications.filter(
            (item) =>
                item.status ===
                "shortlisted"
        ).length;


    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}

            <div>

                <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">

                        <User
                            size={25}
                        />

                    </div>


                    <h1 className="text-4xl font-bold text-gray-900">
                        Candidate Applications
                    </h1>

                </div>


                <p className="text-gray-500 mt-3">
                    Review candidates and manage your recruitment pipeline.
                </p>

            </div>


            {/* Success */}

            {success && (

                <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-5 flex items-center gap-3">

                    <CheckCircle2
                        size={20}
                    />

                    <p>
                        {success}
                    </p>

                </div>
            )}


            {/* Action Error */}

            {actionError && (

                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5">

                    {actionError}

                </div>
            )}


            {/* Statistics */}

            <div className="grid md:grid-cols-4 gap-6">

                <StatCard
                    title="Total Applications"
                    value={
                        applications.length
                    }
                    icon={
                        <FileText
                            size={23}
                        />
                    }
                    className="bg-blue-100 text-blue-600"
                />


                <StatCard
                    title="Applied"
                    value={
                        appliedCount
                    }
                    icon={
                        <CalendarDays
                            size={23}
                        />
                    }
                    className="bg-yellow-100 text-yellow-600"
                />


                <StatCard
                    title="Reviewing"
                    value={
                        reviewingCount
                    }
                    icon={
                        <Search
                            size={23}
                        />
                    }
                    className="bg-indigo-100 text-indigo-600"
                />


                <StatCard
                    title="Shortlisted"
                    value={
                        shortlistedCount
                    }
                    icon={
                        <CheckCircle2
                            size={23}
                        />
                    }
                    className="bg-green-100 text-green-600"
                />

            </div>


            {/* Search + Filter */}

            <div className="bg-white rounded-3xl shadow-lg p-6">

                <div className="grid md:grid-cols-2 gap-4">

                    {/* Search */}

                    <div className="relative">

                        <Search
                            size={20}
                            className="absolute left-4 top-4 text-gray-400"
                        />


                        <input
                            type="search"
                            value={
                                search
                            }
                            onChange={(event) => {

                                setSearch(
                                    event.target.value
                                );

                                setSuccess("");
                                setActionError("");
                            }}
                            placeholder="Search candidates, jobs or companies..."
                            autoComplete="off"
                            className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Status Filter */}

                    <select
                        value={
                            statusFilter
                        }
                        onChange={(event) => {

                            setStatusFilter(
                                event.target.value
                            );

                            setSuccess("");
                            setActionError("");
                        }}
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
                                    {
                                        status.label
                                    }
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* Search Result Count */}

                {search.trim() && (

                    <div className="mt-4 text-sm text-gray-500">

                        Showing{" "}
                        <span className="font-semibold text-gray-800">
                            {
                                filteredApplications.length
                            }
                        </span>{" "}
                        matching application
                        {
                            filteredApplications.length ===
                                1
                                ? ""
                                : "s"
                        }

                    </div>
                )}

            </div>


            {/* Applications */}

            {filteredApplications.length === 0 ? (

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
                                ? "Candidate applications will appear here when candidates apply for your jobs."
                                : "No applications match your current search or status filter."
                        }
                    />

                </div>

            ) : (

                <div className="space-y-5">

                    {filteredApplications.map(
                        (application) => (

                            <CandidateApplicationCard
                                key={
                                    application.id
                                }
                                application={
                                    application
                                }
                                updating={
                                    updatingId ===
                                    application.id
                                }
                                onStatusChange={
                                    handleStatusChange
                                }
                            />

                        )
                    )}

                </div>
            )}

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Candidate Application Card
|--------------------------------------------------------------------------
*/

const CandidateApplicationCard = ({
    application,
    updating,
    onStatusChange,
}) => {

    const candidateName =
        application?.candidate_name ||
        application?.candidate?.username ||
        application?.user_name ||
        application?.user?.username ||
        "Candidate";


    const candidateEmail =
        application?.candidate_email ||
        application?.candidate?.email ||
        application?.user?.email ||
        "";


    const jobTitle =
        application?.job_title ||
        application?.job?.title ||
        "Job";


    const companyName =
        application?.company_name ||
        application?.job?.company?.company_name ||
        "Company";


    const currentStatus =
        application?.status ||
        "applied";


    return (
        <article className="bg-white rounded-3xl shadow-lg p-7 hover:shadow-xl transition">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-7">

                {/* Candidate */}

                <div className="flex items-start gap-5">

                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center shrink-0">

                        <User
                            size={30}
                        />

                    </div>


                    <div>

                        <h2 className="text-xl font-bold text-gray-900">
                            {candidateName}
                        </h2>


                        {candidateEmail && (

                            <p className="flex items-center gap-2 text-gray-500 mt-1">

                                <Mail
                                    size={16}
                                />

                                {candidateEmail}

                            </p>
                        )}


                        <div className="flex flex-wrap gap-5 mt-3 text-sm text-gray-500">

                            <span className="flex items-center gap-2">

                                <Briefcase
                                    size={16}
                                />

                                {jobTitle}

                            </span>


                            <span className="flex items-center gap-2">

                                <Building2
                                    size={16}
                                />

                                {companyName}

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

                </div>


                {/* Status */}

                <div className="flex flex-wrap items-center gap-3">

                    <StatusBadge
                        status={
                            currentStatus
                        }
                    />


                    <div className="relative">

                        <select
                            value={
                                currentStatus
                            }
                            disabled={
                                updating
                            }
                            onChange={(event) =>
                                onStatusChange(
                                    application,
                                    event.target.value
                                )
                            }
                            className="appearance-none border border-gray-200 rounded-xl pl-4 pr-10 py-3 font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                        >

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
                                        {
                                            status.label
                                        }
                                    </option>

                                )
                            )}

                        </select>


                        {updating ? (

                            <Loader2
                                size={17}
                                className="absolute right-3 top-3.5 animate-spin text-blue-600"
                            />

                        ) : (

                            <ChevronDown
                                size={17}
                                className="absolute right-3 top-3.5 pointer-events-none text-gray-400"
                            />

                        )}

                    </div>

                </div>

            </div>


            {/* Cover Letter */}

            {application.cover_letter && (

                <div className="mt-6 bg-slate-50 rounded-2xl p-5">

                    <p className="text-sm font-semibold text-gray-700 mb-2">
                        Cover Letter
                    </p>


                    <p className="text-gray-600 leading-7 whitespace-pre-line">
                        {
                            application.cover_letter
                        }
                    </p>

                </div>
            )}


            {/* Resume */}

            {application.resume && (

                <div className="mt-5">

                    <a
                        href={
                            application.resume
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition"
                    >

                        <FileText
                            size={17}
                        />

                        View Resume

                    </a>

                </div>
            )}

        </article>
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
    className,
}) => (

    <div className="bg-white rounded-3xl shadow-lg p-6">

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
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${className}`}
            >
                {icon}
            </div>

        </div>

    </div>
);


/*
|--------------------------------------------------------------------------
| Status Badge
|--------------------------------------------------------------------------
*/

const StatusBadge = ({
    status,
}) => {

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


    const label =
        APPLICATION_STATUSES.find(
            (item) =>
                item.value ===
                status
        )?.label ||
        status;


    return (

        <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${styles[status] ||
                "bg-gray-100 text-gray-600"
                }`}
        >
            {label}
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


export default RecruiterApplications;