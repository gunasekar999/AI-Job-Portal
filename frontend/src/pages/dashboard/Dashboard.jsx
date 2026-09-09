import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Briefcase,
    Building2,
    ClipboardList,
    TrendingUp,
    Bell,
    Sparkles,
    ArrowUpRight,
    FileText,
    CalendarDays,
    RefreshCw,
} from "lucide-react";

import {
    getJobRecommendations,
    getResumeAnalysis,
} from "../../services/aiService";

import {
    getMyApplications,
} from "../../services/applicationService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";


const Dashboard = () => {
    const navigate = useNavigate();

    const [recommendations, setRecommendations] =
        useState([]);

    const [applications, setApplications] =
        useState([]);

    const [resumeAnalysis, setResumeAnalysis] =
        useState(null);

    const [loadingDashboard, setLoadingDashboard] =
        useState(true);

    const [loadingRecommendations, setLoadingRecommendations] =
        useState(true);

    const [recommendationError, setRecommendationError] =
        useState("");

    const [dashboardError, setDashboardError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Dashboard Data
    |--------------------------------------------------------------------------
    */

    const loadDashboardData = async () => {
        try {
            setLoadingDashboard(true);
            setDashboardError("");

            const [
                resumeResult,
                applicationsResult,
            ] = await Promise.allSettled([
                getResumeAnalysis(),
                getMyApplications(),
            ]);


            /*
            |--------------------------------------------------------------------------
            | Resume Analysis
            |--------------------------------------------------------------------------
            */

            if (
                resumeResult.status ===
                "fulfilled"
            ) {
                setResumeAnalysis(
                    resumeResult.value
                );
            } else {
                setResumeAnalysis(null);
            }


            /*
            |--------------------------------------------------------------------------
            | Applications
            |--------------------------------------------------------------------------
            */

            if (
                applicationsResult.status ===
                "fulfilled"
            ) {
                const data =
                    applicationsResult.value;

                const results =
                    Array.isArray(data)
                        ? data
                        : data.results || [];

                setApplications(results);

            } else {
                setApplications([]);
            }


            /*
            |--------------------------------------------------------------------------
            | Both Failed
            |--------------------------------------------------------------------------
            */

            if (
                resumeResult.status ===
                "rejected" &&
                applicationsResult.status ===
                "rejected"
            ) {
                setDashboardError(
                    "Unable to load your dashboard data."
                );
            }

        } catch (error) {
            console.error(
                "Failed to load dashboard data:",
                error
            );

            setDashboardError(
                "Unable to load your dashboard data."
            );

        } finally {
            setLoadingDashboard(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Load AI Recommendations
    |--------------------------------------------------------------------------
    */

    const loadRecommendations =
        async () => {
            try {
                setLoadingRecommendations(true);
                setRecommendationError("");

                const data =
                    await getJobRecommendations();

                const recommendationList =
                    Array.isArray(data)
                        ? data
                        : data?.recommendations ||
                        data?.results ||
                        [];

                setRecommendations(
                    recommendationList
                );

            } catch (error) {
                console.error(
                    "Failed to load AI recommendations:",
                    error
                );

                setRecommendations([]);

                setRecommendationError(
                    error?.response?.data?.detail ||
                    "Unable to load AI recommendations."
                );

            } finally {
                setLoadingRecommendations(false);
            }
        };


    useEffect(() => {
        loadDashboardData();
        loadRecommendations();
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Dashboard Values
    |--------------------------------------------------------------------------
    */

    const resumeScore =
        resumeAnalysis?.ai_score !==
            undefined &&
            resumeAnalysis?.ai_score !==
            null
            ? `${resumeAnalysis.ai_score}%`
            : "—";


    const appliedJobs =
        applications.length;


    const recentApplications =
        applications.slice(0, 3);


    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    */

    const notifications = [
        resumeAnalysis
            ? "Your resume AI analysis has been completed."
            : "Upload your resume to receive an AI analysis.",

        "A recruiter viewed your profile.",

        recommendations.length > 0
            ? "New AI job recommendations are available."
            : "AI job recommendations are available.",

        "Interview questions are ready for your selected job.",
    ];


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loadingDashboard) {
        return (
            <LoadingSpinner
                text="Loading your dashboard..."
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Dashboard Error
    |--------------------------------------------------------------------------
    */

    if (dashboardError) {
        return (
            <ErrorMessage
                message={dashboardError}
                onRetry={loadDashboardData}
            />
        );
    }


    return (
        <div className="space-y-8">

            {/* Welcome */}

            <div className="rounded-3xl bg-linear-to-r from-blue-700 via-indigo-600 to-purple-600 text-white p-10 shadow-xl">

                <h1 className="text-4xl font-bold">
                    Welcome Back 👋
                </h1>

                <p className="mt-3 text-blue-100 text-lg">
                    Here's your AI-powered career dashboard.
                </p>

            </div>


            {/* Stats */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <DashboardStatCard
                    title="Resume Score"
                    value={resumeScore}
                    icon={Sparkles}
                    color="from-indigo-600 to-blue-600"
                />


                <DashboardStatCard
                    title="Applied Jobs"
                    value={appliedJobs}
                    icon={ClipboardList}
                    color="from-emerald-500 to-green-600"
                />


                <DashboardStatCard
                    title="Recommended Jobs"
                    value={
                        recommendations.length
                    }
                    icon={Briefcase}
                    color="from-orange-500 to-red-500"
                />


                <DashboardStatCard
                    title="Profile Views"
                    value="—"
                    icon={TrendingUp}
                    color="from-purple-500 to-indigo-600"
                />

            </div>


            {/* Middle Section */}

            <div className="grid xl:grid-cols-3 gap-8">

                {/* AI Recommended Jobs */}

                <div className="xl:col-span-2 bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

                        <div>

                            <div className="flex items-center gap-3">

                                <Sparkles
                                    className="text-indigo-600"
                                />

                                <h2 className="text-2xl font-bold">
                                    AI Recommended Jobs
                                </h2>

                            </div>


                            <p className="text-gray-500 mt-2">
                                Jobs selected based on your profile.
                            </p>

                        </div>


                        <div className="flex items-center gap-4">

                            <button
                                type="button"
                                onClick={
                                    loadRecommendations
                                }
                                disabled={
                                    loadingRecommendations
                                }
                                className="text-gray-500 hover:text-blue-600 transition disabled:opacity-50"
                                title="Refresh recommendations"
                            >

                                <RefreshCw
                                    size={18}
                                    className={
                                        loadingRecommendations
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/ai/recommendations"
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

                    </div>


                    {/* Loading */}

                    {loadingRecommendations && (

                        <div className="space-y-5">

                            {[1, 2, 3].map(
                                (item) => (

                                    <div
                                        key={item}
                                        className="border rounded-2xl p-6 animate-pulse"
                                    >

                                        <div className="h-5 bg-gray-200 rounded w-2/3" />

                                        <div className="h-4 bg-gray-200 rounded w-1/2 mt-4" />

                                        <div className="h-4 bg-gray-200 rounded w-1/3 mt-3" />

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {/* Error */}

                    {!loadingRecommendations &&
                        recommendationError && (

                            <ErrorMessage
                                message={
                                    recommendationError
                                }
                                onRetry={
                                    loadRecommendations
                                }
                            />

                        )}


                    {/* Empty */}

                    {!loadingRecommendations &&
                        !recommendationError &&
                        recommendations.length === 0 && (

                            <EmptyState
                                title="No AI Recommendations Yet"
                                message="Complete your profile to get personalized job recommendations."
                            />

                        )}


                    {/* Recommendations */}

                    {!loadingRecommendations &&
                        !recommendationError &&
                        recommendations.length > 0 && (

                            <div className="space-y-5">

                                {recommendations
                                    .slice(0, 3)
                                    .map(
                                        (job) => (

                                            <div
                                                key={
                                                    job.id
                                                }
                                                className="border rounded-2xl p-6 hover:border-blue-500 hover:shadow-md transition"
                                            >

                                                <div className="flex justify-between gap-6">

                                                    <div className="min-w-0">

                                                        <h3 className="text-xl font-bold">
                                                            {
                                                                job.job_title
                                                            }
                                                        </h3>


                                                        <div className="flex flex-wrap gap-6 mt-3 text-gray-500">

                                                            <span className="flex items-center gap-2">

                                                                <Building2
                                                                    size={18}
                                                                />

                                                                {
                                                                    job.company_name
                                                                }

                                                            </span>


                                                            <span className="flex items-center gap-2">

                                                                <Briefcase
                                                                    size={18}
                                                                />

                                                                AI Recommendation

                                                            </span>

                                                        </div>


                                                        <p className="text-gray-600 mt-4 leading-relaxed">
                                                            {
                                                                job.reason
                                                            }
                                                        </p>

                                                    </div>


                                                    {/* Match Score */}

                                                    <div className="text-center shrink-0">

                                                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl font-bold">

                                                            {
                                                                job.recommendation_score
                                                            }%

                                                        </div>

                                                        <p className="mt-2 text-sm text-gray-500">
                                                            AI Match
                                                        </p>

                                                    </div>

                                                </div>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/jobs/${job.job_id}`
                                                        )
                                                    }
                                                    className="mt-5 text-blue-600 font-semibold flex items-center gap-2 hover:text-blue-700"
                                                >

                                                    View Job

                                                    <ArrowUpRight
                                                        size={17}
                                                    />

                                                </button>

                                            </div>

                                        )
                                    )}

                            </div>

                        )}

                </div>


                {/* Notifications */}

                <div className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex items-center gap-3 mb-8">

                        <Bell
                            className="text-blue-600"
                        />

                        <h2 className="text-2xl font-bold">
                            Notifications
                        </h2>

                    </div>


                    <div className="space-y-5">

                        {notifications.map(
                            (
                                item,
                                index
                            ) => (

                                <div
                                    key={index}
                                    className="bg-slate-100 rounded-2xl p-5"
                                >

                                    {item}

                                </div>

                            )
                        )}

                    </div>

                </div>

            </div>


            {/* Bottom */}

            <div className="grid lg:grid-cols-2 gap-8">

                {/* AI Career Insights */}

                <div className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex items-center gap-3 mb-6">

                        <Sparkles
                            className="text-indigo-600"
                        />

                        <h2 className="text-2xl font-bold">
                            AI Career Insights
                        </h2>

                    </div>


                    <ul className="space-y-4 text-gray-700">

                        <li>
                            ✔ Improve Docker knowledge.
                        </li>

                        <li>
                            ✔ Learn AWS deployment.
                        </li>

                        <li>
                            ✔ Add measurable achievements.
                        </li>

                        <li>
                            ✔ Complete two React projects.
                        </li>

                        <li>
                            ✔ Practice 20 AI interview questions.
                        </li>

                    </ul>

                </div>


                {/* Recent Applications */}

                <div className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex items-center justify-between mb-6">

                        <div className="flex items-center gap-3">

                            <FileText
                                className="text-green-600"
                            />

                            <h2 className="text-2xl font-bold">
                                Recent Applications
                            </h2>

                        </div>


                        {applications.length > 0 && (

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/applications"
                                    )
                                }
                                className="text-blue-600 font-semibold flex items-center gap-1"
                            >

                                View All

                                <ArrowUpRight
                                    size={17}
                                />

                            </button>

                        )}

                    </div>


                    {recentApplications.length ===
                        0 ? (

                        <EmptyState
                            title="No Applications Yet"
                            message="Apply for jobs to track your applications here."
                        />


                    ) : (

                        <div className="space-y-5">

                            {recentApplications.map(
                                (
                                    application
                                ) => (

                                    <div
                                        key={
                                            application.id
                                        }
                                        className="flex justify-between gap-4 border-b pb-4 last:border-b-0"
                                    >

                                        <div className="min-w-0">

                                            <p className="font-semibold text-gray-900 truncate">

                                                {
                                                    application.job_title ||
                                                    application.job?.title ||
                                                    "Job"
                                                }

                                            </p>


                                            <p className="text-sm text-gray-500 mt-1">

                                                {
                                                    application.company_name ||
                                                    application.job?.company?.company_name ||
                                                    "Company"
                                                }

                                            </p>


                                            {application.created_at && (

                                                <p className="flex items-center gap-1 text-xs text-gray-400 mt-2">

                                                    <CalendarDays
                                                        size={13}
                                                    />

                                                    {formatDate(
                                                        application.created_at
                                                    )}

                                                </p>

                                            )}

                                        </div>


                                        <span
                                            className={`shrink-0 h-fit px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(
                                                application.status
                                            )}`}
                                        >

                                            {formatStatus(
                                                application.status
                                            )}

                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Dashboard Stat Card
|--------------------------------------------------------------------------
*/

const DashboardStatCard = ({
    title,
    value,
    icon: Icon,
    color,
}) => (

    <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition">

        <div className="flex justify-between">

            <div>

                <p className="text-gray-500">
                    {title}
                </p>

                <h2 className="text-4xl font-bold mt-3">
                    {value}
                </h2>

            </div>


            <div
                className={`w-16 h-16 rounded-2xl bg-linear-to-r ${color} flex items-center justify-center`}
            >

                <Icon
                    className="text-white"
                    size={28}
                />

            </div>

        </div>

    </div>
);


/*
|--------------------------------------------------------------------------
| Status Label
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


export default Dashboard;