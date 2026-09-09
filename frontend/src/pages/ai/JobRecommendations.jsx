import { useEffect, useMemo, useState } from "react";

import {
    Briefcase,
    Building2,
    Search,
    Sparkles,
    ArrowUpRight,
    RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getJobRecommendations } from "../../services/aiService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";


const JobRecommendations = () => {
    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(true);

    const [recommendations, setRecommendations] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [error, setError] =
        useState("");


    const loadRecommendations =
        async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getJobRecommendations();

                setRecommendations(
                    Array.isArray(response)
                        ? response
                        : response?.results || []
                );

            } catch (error) {
                console.error(
                    "Unable to load AI recommendations:",
                    error
                );

                setError(
                    error?.response?.data?.detail ||
                    "Unable to load AI recommendations. Please try again."
                );

            } finally {
                setLoading(false);
            }
        };


    useEffect(() => {
        loadRecommendations();
    }, []);


    const filteredJobs = useMemo(() => {
        const keyword =
            search
                .trim()
                .toLowerCase();


        if (!keyword) {
            return recommendations;
        }


        return recommendations.filter(
            (job) => {

                const title =
                    job.job_title
                        ?.toLowerCase() ||
                    "";

                const company =
                    job.company_name
                        ?.toLowerCase() ||
                    "";

                const reason =
                    job.reason
                        ?.toLowerCase() ||
                    "";


                return (
                    title.includes(
                        keyword
                    ) ||
                    company.includes(
                        keyword
                    ) ||
                    reason.includes(
                        keyword
                    )
                );
            }
        );

    }, [
        recommendations,
        search,
    ]);


    if (loading) {
        return (
            <LoadingSpinner
                text="Generating your AI job recommendations..."
            />
        );
    }


    return (
        <div className="min-h-screen bg-slate-100">

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Header */}

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">

                    <div>

                        <div className="flex items-center gap-3">

                            <Sparkles
                                size={32}
                                className="text-indigo-600"
                            />

                            <h1 className="text-4xl font-bold text-gray-900">
                                AI Job Recommendations
                            </h1>

                        </div>


                        <p className="text-gray-500 mt-3">
                            Personalized job opportunities based on your profile.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={
                            loadRecommendations
                        }
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                    >

                        <RefreshCw
                            size={18}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </div>


                {/* Error */}

                {error && (
                    <div className="mb-8">

                        <ErrorMessage
                            message={error}
                            onRetry={
                                loadRecommendations
                            }
                        />

                    </div>
                )}


                {/* Summary */}

                <div className="grid md:grid-cols-2 gap-6 mb-8">

                    <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-blue-100 text-lg">
                                    AI Recommendations
                                </p>

                                <h2 className="text-5xl font-bold mt-3">
                                    {recommendations.length}
                                </h2>

                                <p className="text-blue-100 mt-2">
                                    Jobs matched to your profile
                                </p>

                            </div>


                            <Sparkles
                                size={60}
                            />

                        </div>

                    </div>


                    <div className="bg-linear-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl">

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-green-100 text-lg">
                                    Top Match
                                </p>

                                <h2 className="text-5xl font-bold mt-3">

                                    {recommendations.length >
                                        0
                                        ? `${recommendations[0].recommendation_score}%`
                                        : "0%"}

                                </h2>

                                <p className="text-green-100 mt-2">
                                    Highest AI compatibility score
                                </p>

                            </div>


                            <Briefcase
                                size={60}
                            />

                        </div>

                    </div>

                </div>


                {/* Search */}

                <div className="bg-white rounded-2xl shadow-lg p-5 mb-8">

                    <div className="relative">

                        <Search
                            className="absolute left-4 top-3.5 text-gray-400"
                            size={20}
                        />

                        <input
                            type="text"
                            placeholder="Search recommended jobs..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                </div>


                {/* Results */}

                {filteredJobs.length === 0 ? (

                    <div className="bg-white rounded-3xl shadow-lg">

                        <EmptyState
                            title={
                                recommendations.length ===
                                    0
                                    ? "No AI Recommendations Yet"
                                    : "No Recommendations Found"
                            }
                            message={
                                recommendations.length ===
                                    0
                                    ? "Complete your candidate profile and make sure your skills and experience are updated to improve AI matching."
                                    : "Try another search to find matching recommendations."
                            }
                        />

                    </div>

                ) : (

                    <div className="grid xl:grid-cols-2 gap-8">

                        {filteredJobs.map(
                            (job) => (

                                <div
                                    key={
                                        job.id
                                    }
                                    className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 p-8"
                                >

                                    {/* Job Header */}

                                    <div className="flex justify-between items-start gap-6">

                                        <div className="min-w-0">

                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {
                                                    job.job_title
                                                }
                                            </h2>


                                            <div className="mt-4 space-y-3 text-gray-600">

                                                <div className="flex items-center gap-2">

                                                    <Building2
                                                        size={18}
                                                        className="text-blue-600"
                                                    />

                                                    <span>
                                                        {
                                                            job.company_name
                                                        }
                                                    </span>

                                                </div>


                                                <div className="flex items-center gap-2">

                                                    <Briefcase
                                                        size={18}
                                                        className="text-blue-600"
                                                    />

                                                    <span>
                                                        AI Recommended Job
                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        {/* Match Score */}

                                        <div className="bg-blue-600 text-white rounded-2xl px-5 py-4 text-center shrink-0">

                                            <p className="text-xs font-medium">
                                                AI MATCH
                                            </p>

                                            <h3 className="text-3xl font-bold">
                                                {
                                                    job.recommendation_score
                                                }%
                                            </h3>

                                        </div>

                                    </div>


                                    {/* Recommendation Reason */}

                                    <div className="mt-8 bg-slate-50 rounded-2xl p-5">

                                        <div className="flex items-center gap-2 mb-3">

                                            <Sparkles
                                                size={18}
                                                className="text-indigo-600"
                                            />

                                            <h3 className="font-semibold">
                                                Why this job matches you
                                            </h3>

                                        </div>


                                        <p className="text-gray-600 leading-relaxed">
                                            {
                                                job.reason ||
                                                "This job was recommended based on your profile."
                                            }
                                        </p>

                                    </div>


                                    {/* Actions */}

                                    <div className="flex gap-4 mt-8">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/jobs/${job.job_id}`
                                                )
                                            }
                                            className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-95 transition flex items-center justify-center gap-2"
                                        >

                                            View Job

                                            <ArrowUpRight
                                                size={18}
                                            />

                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
};


export default JobRecommendations;