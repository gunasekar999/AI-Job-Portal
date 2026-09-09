import { useEffect, useMemo, useState } from "react";

import {
    AlertCircle,
    ArrowRight,
    Briefcase,
    Building2,
    CheckCircle2,
    Clock3,
    Lightbulb,
    RefreshCw,
    Sparkles,
    Target,
    XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
    getMyAIMatches,
} from "../../services/aiService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";


const MyAIMatches = () => {
    const navigate = useNavigate();

    const [matches, setMatches] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");


    useEffect(() => {
        loadMatches();
    }, []);


    const loadMatches = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getMyAIMatches();

            setMatches(
                Array.isArray(data)
                    ? data
                    : data.results || []
            );

        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.detail ||
                "Unable to load your AI matches. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };


    const filteredMatches = useMemo(() => {
        const keyword =
            search
                .trim()
                .toLowerCase();


        if (!keyword) {
            return matches;
        }


        return matches.filter(
            (match) => {

                const jobTitle =
                    String(
                        match.job_title ||
                        ""
                    ).toLowerCase();

                const summary =
                    String(
                        match.summary ||
                        ""
                    ).toLowerCase();

                const matchingSkills =
                    Array.isArray(
                        match.matching_skills
                    )
                        ? match.matching_skills
                            .join(" ")
                            .toLowerCase()
                        : "";

                const missingSkills =
                    Array.isArray(
                        match.missing_skills
                    )
                        ? match.missing_skills
                            .join(" ")
                            .toLowerCase()
                        : "";


                return (
                    jobTitle.includes(
                        keyword
                    ) ||
                    summary.includes(
                        keyword
                    ) ||
                    matchingSkills.includes(
                        keyword
                    ) ||
                    missingSkills.includes(
                        keyword
                    )
                );
            }
        );

    }, [
        matches,
        search,
    ]);


    const averageScore =
        matches.length > 0
            ? Math.round(
                matches.reduce(
                    (total, match) =>
                        total +
                        normalizeScore(
                            match.match_score
                        ),
                    0
                ) / matches.length
            )
            : 0;


    const excellentMatches =
        matches.filter(
            (match) =>
                normalizeScore(
                    match.match_score
                ) >= 80
        ).length;


    if (loading) {
        return (
            <LoadingSpinner
                text="Loading your AI matches..."
            />
        );
    }


    if (error) {
        return (
            <ErrorMessage
                message={error}
                onRetry={loadMatches}
            />
        );
    }


    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">

                            <Sparkles
                                size={25}
                            />

                        </div>


                        <h1 className="text-4xl font-bold text-gray-900">
                            My AI Matches
                        </h1>

                    </div>


                    <p className="text-gray-500 mt-3">
                        Review your AI-powered compatibility analysis for jobs.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={loadMatches}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >

                    <RefreshCw
                        size={18}
                    />

                    Refresh

                </button>

            </div>


            {/* Search */}

            {matches.length > 0 && (

                <div className="bg-white rounded-3xl shadow-lg p-5">

                    <div className="relative">

                        <svg
                            className="absolute left-4 top-3.5 text-gray-400"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle
                                cx="11"
                                cy="11"
                                r="8"
                            />

                            <path
                                d="m21 21-4.3-4.3"
                            />

                        </svg>


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search jobs, summaries or skills..."
                            className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                </div>

            )}


            {/* Statistics */}

            {matches.length > 0 && (

                <div className="grid md:grid-cols-3 gap-6">

                    <StatCard
                        title="Total AI Matches"
                        value={
                            matches.length
                        }
                        icon={
                            <Sparkles
                                size={24}
                            />
                        }
                        className="bg-indigo-100 text-indigo-600"
                    />


                    <StatCard
                        title="Average Match"
                        value={`${averageScore}%`}
                        icon={
                            <Target
                                size={24}
                            />
                        }
                        className="bg-blue-100 text-blue-600"
                    />


                    <StatCard
                        title="Excellent Matches"
                        value={
                            excellentMatches
                        }
                        icon={
                            <CheckCircle2
                                size={24}
                            />
                        }
                        className="bg-green-100 text-green-600"
                    />

                </div>

            )}


            {/* Empty */}

            {matches.length === 0 && (

                <div className="bg-white rounded-3xl shadow-lg">

                    <EmptyState
                        title="No AI Matches Yet"
                        message="Open a job and use AI Match Analysis to discover how well your profile matches the position."
                    />


                    <div className="flex justify-center pb-8">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/jobs"
                                )
                            }
                            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                            Explore Jobs
                        </button>

                    </div>

                </div>

            )}


            {/* No Search Results */}

            {matches.length > 0 &&
                filteredMatches.length === 0 && (

                    <div className="bg-white rounded-3xl shadow-lg">

                        <EmptyState
                            title="No Matching AI Results"
                            message="Try searching with another job title, summary or skill."
                        />

                    </div>

                )}


            {/* Match List */}

            {filteredMatches.length > 0 && (

                <div className="grid lg:grid-cols-2 gap-6">

                    {filteredMatches.map(
                        (match) => (

                            <MatchCard
                                key={
                                    match.id
                                }
                                match={
                                    match
                                }
                                onOpen={() =>
                                    navigate(
                                        `/jobs/${match.job}`
                                    )
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
| Match Card
|--------------------------------------------------------------------------
*/

const MatchCard = ({
    match,
    onOpen,
}) => {

    const score =
        normalizeScore(
            match.match_score
        );


    const scoreLabel =
        score >= 80
            ? "Excellent Match"
            : score >= 60
                ? "Good Match"
                : score >= 40
                    ? "Partial Match"
                    : "Low Match";


    return (
        <article className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition overflow-hidden">

            <div className="p-7">

                {/* Header */}

                <div className="flex items-start justify-between gap-5">

                    <div className="flex items-start gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">

                            <Briefcase
                                size={27}
                            />

                        </div>


                        <div>

                            <h2 className="text-xl font-bold text-gray-900">
                                {match.job_title ||
                                    "Job"}
                            </h2>


                            <p className="flex items-center gap-2 text-gray-500 mt-1">

                                <Building2
                                    size={16}
                                />

                                {match.company_name || "Company"}

                            </p>

                        </div>

                    </div>


                    {/* Score */}

                    <div className="text-center shrink-0">

                        <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex flex-col items-center justify-center">

                            <span className="text-2xl font-bold">
                                {score}%
                            </span>

                            <span className="text-[10px] font-medium">
                                MATCH
                            </span>

                        </div>

                    </div>

                </div>


                {/* Score Label */}

                <div className="mt-5">

                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-bold">

                        <Target
                            size={15}
                        />

                        {scoreLabel}

                    </span>

                </div>


                {/* Summary */}

                {match.summary && (

                    <div className="mt-5 bg-slate-50 rounded-2xl p-4">

                        <p className="text-sm text-gray-600 leading-6">
                            {match.summary}
                        </p>

                    </div>

                )}


                {/* Matching Skills */}

                {match.matching_skills?.length >
                    0 && (

                        <SkillSection
                            title="Matching Skills"
                            skills={
                                match.matching_skills
                            }
                            type="matching"
                        />

                    )}


                {/* Missing Skills */}

                {match.missing_skills?.length >
                    0 && (

                        <SkillSection
                            title="Skills to Improve"
                            skills={
                                match.missing_skills
                            }
                            type="missing"
                        />

                    )}


                {/* Strengths */}

                {match.strengths?.length >
                    0 && (

                        <TextListSection
                            title="Your Strengths"
                            items={
                                match.strengths
                            }
                            icon={
                                <CheckCircle2
                                    size={16}
                                    className="text-green-600 mt-0.5 shrink-0"
                                />
                            }
                        />

                    )}


                {/* Recommendations */}

                {match.recommendations?.length >
                    0 && (

                        <TextListSection
                            title="AI Recommendations"
                            items={
                                match.recommendations
                            }
                            icon={
                                <Lightbulb
                                    size={16}
                                    className="text-indigo-600 mt-0.5 shrink-0"
                                />
                            }
                        />

                    )}


                {/* Date */}

                {match.updated_at && (

                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-6">

                        <Clock3
                            size={14}
                        />

                        Last analyzed{" "}

                        {formatDate(
                            match.updated_at
                        )}

                    </div>

                )}

            </div>


            {/* Footer */}

            <div className="border-t border-gray-100 px-7 py-5">

                <button
                    type="button"
                    onClick={onOpen}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >

                    View Job & AI Analysis

                    <ArrowRight
                        size={18}
                    />

                </button>

            </div>

        </article>
    );
};


/*
|--------------------------------------------------------------------------
| Skill Section
|--------------------------------------------------------------------------
*/

const SkillSection = ({
    title,
    skills,
    type,
}) => (

    <div className="mt-5">

        <h3 className="font-bold text-gray-900 text-sm">
            {title}
        </h3>


        <div className="flex flex-wrap gap-2 mt-3">

            {skills
                .slice(0, 6)
                .map(
                    (
                        skill,
                        index
                    ) => (

                        <span
                            key={
                                `${skill}-${index}`
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${type ===
                                "matching"
                                ? "bg-green-50 text-green-700"
                                : "bg-orange-50 text-orange-700"
                                }`}
                        >

                            {type ===
                                "matching" ? (
                                <CheckCircle2
                                    size={13}
                                />
                            ) : (
                                <XCircle
                                    size={13}
                                />
                            )}

                            {skill}

                        </span>

                    )
                )}

        </div>

    </div>
);


/*
|--------------------------------------------------------------------------
| Text List Section
|--------------------------------------------------------------------------
*/

const TextListSection = ({
    title,
    items,
    icon,
}) => (

    <div className="mt-5">

        <h3 className="font-bold text-gray-900 text-sm">
            {title}
        </h3>


        <div className="mt-3 space-y-2">

            {items
                .slice(0, 3)
                .map(
                    (
                        item,
                        index
                    ) => (

                        <div
                            key={
                                index
                            }
                            className="flex items-start gap-2"
                        >

                            {icon}

                            <p className="text-sm text-gray-600">
                                {item}
                            </p>

                        </div>

                    )
                )}

        </div>

    </div>
);


/*
|--------------------------------------------------------------------------
| Statistic Card
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
| Helpers
|--------------------------------------------------------------------------
*/

const normalizeScore = (
    value
) => {

    const number =
        Number(value || 0);

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(number)
        )
    );
};


const formatDate = (
    date
) => {

    try {

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

    } catch {

        return date;

    }
};


export default MyAIMatches;