import {
    AlertCircle,
    CheckCircle2,
    Lightbulb,
    Loader2,
    Sparkles,
    Target,
} from "lucide-react";

const AIMatchCard = ({
    result,
    loading = false,
    error = "",
    onAnalyze,
}) => {
    if (loading) {
        return (
            <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-3xl p-7 text-white shadow-xl">

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                        <Sparkles size={23} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">
                            AI Match Analysis
                        </h2>

                        <p className="text-blue-100 text-sm">
                            Analyzing your profile...
                        </p>
                    </div>

                </div>

                <div className="flex items-center justify-center py-10">

                    <div className="text-center">

                        <Loader2
                            size={42}
                            className="mx-auto animate-spin"
                        />

                        <p className="mt-4 text-blue-100">
                            AI is comparing your profile with this job.
                        </p>

                    </div>

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-3xl shadow-lg border border-red-100 p-7">

                <div className="flex items-start gap-4">

                    <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <AlertCircle size={23} />
                    </div>

                    <div className="flex-1">

                        <h2 className="text-xl font-bold text-gray-900">
                            AI Match Analysis
                        </h2>

                        <p className="text-red-600 mt-2">
                            {error}
                        </p>

                        {onAnalyze && (
                            <button
                                type="button"
                                onClick={onAnalyze}
                                className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                            >
                                Try Again
                            </button>
                        )}

                    </div>

                </div>

            </div>
        );
    }

    if (!result) {
        return (
            <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-3xl p-7 text-white shadow-xl">

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                        <Sparkles size={23} />
                    </div>

                    <div>

                        <h2 className="text-xl font-bold">
                            AI Match Analysis
                        </h2>

                        <p className="text-blue-100 text-sm">
                            See how well your profile matches this role.
                        </p>

                    </div>

                </div>

                {onAnalyze && (
                    <button
                        type="button"
                        onClick={onAnalyze}
                        className="w-full mt-7 bg-white text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Sparkles size={18} />
                            Analyze My Match
                        </span>
                    </button>
                )}

            </div>
        );
    }

    const score = Math.min(
        100,
        Math.max(
            0,
            Number(result.match_score || 0)
        )
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
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

            {/* Header */}

            <div className="bg-linear-to-r from-indigo-600 to-blue-700 text-white p-7">

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                        <Sparkles size={23} />
                    </div>

                    <div>

                        <h2 className="text-xl font-bold">
                            AI Match Analysis
                        </h2>

                        <p className="text-blue-100 text-sm">
                            Personalized analysis of your profile.
                        </p>

                    </div>

                </div>

            </div>

            <div className="p-7">

                {/* Score */}

                <div className="flex flex-col items-center">

                    <div className="relative w-36 h-36">

                        <svg
                            className="w-36 h-36 -rotate-90"
                            viewBox="0 0 120 120"
                        >

                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="10"
                                className="text-gray-100"
                            />

                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray="314"
                                strokeDashoffset={
                                    314 -
                                    (314 * score) /
                                    100
                                }
                                className="text-blue-600"
                            />

                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">

                            <span className="text-3xl font-bold text-gray-900">
                                {score}%
                            </span>

                            <span className="text-xs text-gray-500">
                                Match
                            </span>

                        </div>

                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mt-4">
                        {scoreLabel}
                    </h3>

                </div>

                {/* Summary */}

                {result.summary && (
                    <div className="mt-7 bg-blue-50 rounded-2xl p-5">

                        <div className="flex items-center gap-2 mb-2">

                            <Target
                                size={18}
                                className="text-blue-600"
                            />

                            <p className="text-sm font-bold text-blue-900">
                                AI Summary
                            </p>

                        </div>

                        <p className="text-blue-800 leading-6">
                            {result.summary}
                        </p>

                    </div>
                )}

                {/* Matching Skills */}

                {result.matching_skills?.length > 0 && (
                    <div className="mt-7">

                        <h3 className="font-bold text-gray-900">
                            Matching Skills
                        </h3>

                        <div className="flex flex-wrap gap-2 mt-3">

                            {result.matching_skills.map(
                                (skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-semibold"
                                    >
                                        <CheckCircle2
                                            size={15}
                                        />

                                        {skill}
                                    </span>
                                )
                            )}

                        </div>

                    </div>
                )}

                {/* Missing Skills */}

                {result.missing_skills?.length > 0 && (
                    <div className="mt-7">

                        <h3 className="font-bold text-gray-900">
                            Skills to Improve
                        </h3>

                        <div className="flex flex-wrap gap-2 mt-3">

                            {result.missing_skills.map(
                                (skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 text-orange-700 text-sm font-semibold"
                                    >
                                        <AlertCircle
                                            size={15}
                                        />

                                        {skill}
                                    </span>
                                )
                            )}

                        </div>

                    </div>
                )}

                {/* Strengths */}

                {result.strengths?.length > 0 && (
                    <div className="mt-7">

                        <h3 className="font-bold text-gray-900">
                            Your Strengths
                        </h3>

                        <div className="mt-3 space-y-2">

                            {result.strengths.map(
                                (strength, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 bg-green-50 rounded-xl p-3"
                                    >

                                        <CheckCircle2
                                            size={18}
                                            className="text-green-600 mt-0.5 shrink-0"
                                        />

                                        <p className="text-sm text-green-800">
                                            {strength}
                                        </p>

                                    </div>
                                )
                            )}

                        </div>

                    </div>
                )}

                {/* Recommendations */}

                {result.recommendations?.length > 0 && (
                    <div className="mt-7">

                        <h3 className="font-bold text-gray-900">
                            AI Recommendations
                        </h3>

                        <div className="mt-3 space-y-2">

                            {result.recommendations.map(
                                (
                                    recommendation,
                                    index
                                ) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 bg-indigo-50 rounded-xl p-3"
                                    >

                                        <Lightbulb
                                            size={18}
                                            className="text-indigo-600 mt-0.5 shrink-0"
                                        />

                                        <p className="text-sm text-indigo-800">
                                            {recommendation}
                                        </p>

                                    </div>
                                )
                            )}

                        </div>

                    </div>
                )}

                {/* Analyze Again */}

                {onAnalyze && (
                    <button
                        type="button"
                        onClick={onAnalyze}
                        className="w-full mt-7 border border-blue-200 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
                    >
                        Analyze Again
                    </button>
                )}

            </div>

        </div>
    );
};

export default AIMatchCard;