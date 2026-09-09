import { useEffect, useState } from "react";

import {
    BrainCircuit,
    Clipboard,
    Check,
    Loader2,
    Sparkles,
    RefreshCw,
    Building2,
    MapPin,
    ChevronDown,
} from "lucide-react";

import {
    getInterviewQuestions,
    generateInterviewQuestions,
    regenerateInterviewQuestions,
} from "../../services/aiService";

import {
    getJobs,
} from "../../services/jobService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";


const SAVED_INTERVIEW_JOB_KEY =
    "interview_questions_selected_job";


const InterviewQuestions = () => {

    const [jobs, setJobs] =
        useState([]);

    const [jobId, setJobId] =
        useState("");

    const [job, setJob] =
        useState(null);

    const [loadingJobs, setLoadingJobs] =
        useState(true);

    const [loading, setLoading] =
        useState(false);

    const [regenerating, setRegenerating] =
        useState(false);

    const [questions, setQuestions] =
        useState([]);

    const [createdAt, setCreatedAt] =
        useState(null);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [copiedIndex, setCopiedIndex] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Load Jobs
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadJobs();
    }, []);


    const loadJobs = async () => {
        try {
            setLoadingJobs(true);
            setError("");

            const response =
                await getJobs();


            const jobList =
                Array.isArray(response)
                    ? response
                    : response?.results || [];


            setJobs(
                jobList
            );


            /*
            |--------------------------------------------------------------------------
            | Restore Previously Selected Job
            |--------------------------------------------------------------------------
            */

            const savedJobId =
                localStorage.getItem(
                    SAVED_INTERVIEW_JOB_KEY
                );


            if (savedJobId) {

                const savedJob =
                    jobList.find(
                        (item) =>
                            String(item.id) ===
                            String(savedJobId)
                    );


                if (savedJob) {

                    setJobId(
                        String(savedJobId)
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Automatically Load Saved Questions
                    |--------------------------------------------------------------------------
                    */

                    await loadExistingQuestions(
                        String(savedJobId),
                        jobList
                    );

                } else {

                    /*
                    |--------------------------------------------------------------------------
                    | Saved Job No Longer Exists
                    |--------------------------------------------------------------------------
                    */

                    localStorage.removeItem(
                        SAVED_INTERVIEW_JOB_KEY
                    );

                }
            }

        } catch (error) {
            console.error(
                "Unable to load jobs:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to load jobs. Please try again."
            );

        } finally {
            setLoadingJobs(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Handle Job Selection
    |--------------------------------------------------------------------------
    */

    const handleJobChange = async (
        event
    ) => {

        const selectedJobId =
            event.target.value;


        setJobId(
            selectedJobId
        );

        setError("");
        setSuccess("");
        setQuestions([]);
        setJob(null);
        setCreatedAt(null);


        /*
        |--------------------------------------------------------------------------
        | Save Selected Job
        |--------------------------------------------------------------------------
        */

        if (selectedJobId) {

            localStorage.setItem(
                SAVED_INTERVIEW_JOB_KEY,
                selectedJobId
            );

        } else {

            localStorage.removeItem(
                SAVED_INTERVIEW_JOB_KEY
            );

        }


        if (!selectedJobId) {
            return;
        }


        await loadExistingQuestions(
            selectedJobId,
            jobs
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Load Existing Questions
    |--------------------------------------------------------------------------
    */

    const loadExistingQuestions =
        async (
            selectedJobId,
            availableJobs = jobs
        ) => {

            try {
                setLoading(true);
                setError("");
                setSuccess("");


                const existing =
                    await getInterviewQuestions(
                        selectedJobId
                    );


                setJob(
                    existing.job ||
                    availableJobs.find(
                        (item) =>
                            String(item.id) ===
                            String(selectedJobId)
                    ) ||
                    null
                );


                setQuestions(
                    Array.isArray(
                        existing.questions
                    )
                        ? existing.questions
                        : []
                );


                setCreatedAt(
                    existing.created_at ||
                    existing.updated_at ||
                    null
                );


                if (
                    Array.isArray(
                        existing.questions
                    ) &&
                    existing.questions.length > 0
                ) {

                    setSuccess(
                        "Saved interview questions loaded successfully."
                    );
                }

            } catch (error) {

                /*
                |--------------------------------------------------------------------------
                | 404 = No Saved Questions
                |--------------------------------------------------------------------------
                */

                if (
                    error?.response?.status ===
                    404
                ) {

                    const selectedJob =
                        availableJobs.find(
                            (item) =>
                                String(item.id) ===
                                String(selectedJobId)
                        );


                    setJob(
                        selectedJob ||
                        null
                    );


                    setQuestions(
                        []
                    );

                    setCreatedAt(
                        null
                    );

                    return;
                }


                console.error(
                    "Interview question loading error:",
                    error
                );


                setError(
                    error?.response?.data?.detail ||
                    error?.response?.data?.error ||
                    "Unable to load interview questions. Please try again."
                );

            } finally {
                setLoading(false);
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Generate New Questions
    |--------------------------------------------------------------------------
    */

    const handleGenerate = async () => {

        const trimmedJobId =
            jobId.trim();


        if (!trimmedJobId) {
            setError(
                "Please select a job."
            );

            return;
        }


        try {
            setLoading(true);
            setError("");
            setSuccess("");
            setQuestions([]);
            setJob(null);


            /*
            |--------------------------------------------------------------------------
            | Remember Selected Job
            |--------------------------------------------------------------------------
            */

            localStorage.setItem(
                SAVED_INTERVIEW_JOB_KEY,
                trimmedJobId
            );


            const generated =
                await generateInterviewQuestions(
                    trimmedJobId
                );


            setJob(
                generated.job ||
                jobs.find(
                    (item) =>
                        String(item.id) ===
                        String(trimmedJobId)
                ) ||
                null
            );


            setQuestions(
                Array.isArray(
                    generated.questions
                )
                    ? generated.questions
                    : []
            );


            setCreatedAt(
                generated.created_at ||
                generated.updated_at ||
                null
            );


            setSuccess(
                "Interview questions generated successfully."
            );

        } catch (error) {
            console.error(
                "Interview question generation error:",
                error
            );


            setError(
                error?.response?.data?.detail ||
                error?.response?.data?.error ||
                "Unable to generate interview questions. Please try again."
            );


            setQuestions([]);

        } finally {
            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Regenerate Questions
    |--------------------------------------------------------------------------
    */

    const handleRegenerate = async () => {

        const trimmedJobId =
            jobId.trim();


        if (!trimmedJobId) {
            setError(
                "Please select a job."
            );

            return;
        }


        try {
            setRegenerating(true);
            setError("");
            setSuccess("");


            /*
            |--------------------------------------------------------------------------
            | Remember Selected Job
            |--------------------------------------------------------------------------
            */

            localStorage.setItem(
                SAVED_INTERVIEW_JOB_KEY,
                trimmedJobId
            );


            const response =
                await regenerateInterviewQuestions(
                    trimmedJobId
                );


            setJob(
                response.job ||
                job ||
                jobs.find(
                    (item) =>
                        String(item.id) ===
                        String(trimmedJobId)
                ) ||
                null
            );


            setQuestions(
                Array.isArray(
                    response.questions
                )
                    ? response.questions
                    : []
            );


            setCreatedAt(
                response.updated_at ||
                response.created_at ||
                null
            );


            setSuccess(
                "Interview questions regenerated successfully."
            );

        } catch (error) {
            console.error(
                "Interview question regeneration error:",
                error
            );


            setError(
                error?.response?.data?.detail ||
                error?.response?.data?.error ||
                "Unable to regenerate interview questions. Please try again."
            );

        } finally {
            setRegenerating(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Copy Question
    |--------------------------------------------------------------------------
    */

    const copyQuestion = async (
        question,
        index
    ) => {

        try {
            await navigator.clipboard.writeText(
                question
            );


            setCopiedIndex(
                index
            );


            setTimeout(() => {
                setCopiedIndex(
                    null
                );
            }, 2000);

        } catch (error) {
            console.error(
                "Unable to copy question:",
                error
            );


            setError(
                "Unable to copy the question."
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Loading Jobs
    |--------------------------------------------------------------------------
    */

    if (loadingJobs) {
        return (
            <LoadingSpinner
                text="Loading available jobs..."
            />
        );
    }


    return (
        <div className="min-h-screen bg-slate-100">

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Header */}

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">

                    <div>

                        <div className="flex items-center gap-3">

                            <Sparkles
                                size={32}
                                className="text-indigo-600"
                            />

                            <h1 className="text-4xl font-bold text-gray-900">
                                AI Interview Assistant
                            </h1>

                        </div>


                        <p className="text-gray-500 mt-3">
                            Generate personalized interview questions based on a specific job.
                        </p>

                    </div>


                    <div className="hidden md:flex w-16 h-16 rounded-2xl bg-indigo-100 items-center justify-center">

                        <BrainCircuit
                            size={34}
                            className="text-indigo-600"
                        />

                    </div>

                </div>


                {/* Generator */}

                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

                    <div className="flex flex-col md:flex-row gap-4">

                        <div className="relative flex-1">

                            <BriefcaseSelectIcon />


                            <select
                                value={jobId}
                                onChange={
                                    handleJobChange
                                }
                                disabled={
                                    loading ||
                                    regenerating ||
                                    jobs.length === 0
                                }
                                className="w-full appearance-none border border-gray-200 rounded-xl pl-12 pr-12 py-4 outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >

                                <option value="">
                                    Select a job to prepare for
                                </option>


                                {jobs.map(
                                    (item) => (

                                        <option
                                            key={
                                                item.id
                                            }
                                            value={
                                                item.id
                                            }
                                        >
                                            {item.title}
                                            {item.company_name
                                                ? ` — ${item.company_name}`
                                                : ""}
                                        </option>

                                    )
                                )}

                            </select>


                            <ChevronDown
                                size={20}
                                className="absolute right-4 top-4 text-gray-400 pointer-events-none"
                            />

                        </div>


                        <button
                            type="button"
                            onClick={
                                handleGenerate
                            }
                            disabled={
                                loading ||
                                regenerating ||
                                !jobId
                            }
                            className="bg-linear-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:opacity-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                            {loading ? (

                                <>

                                    <Loader2
                                        size={20}
                                        className="animate-spin"
                                    />

                                    Loading...

                                </>

                            ) : (

                                <>

                                    <Sparkles
                                        size={20}
                                    />

                                    Generate

                                </>

                            )}

                        </button>

                    </div>


                    <p className="text-sm text-gray-500 mt-4">
                        Select an active job to load existing questions or generate a personalized set with AI.
                    </p>


                    {jobs.length === 0 && (

                        <div className="mt-5 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl px-4 py-3">

                            No active jobs are currently available.

                        </div>

                    )}

                </div>


                {/* Error */}

                {error && !loading && (

                    <div className="mb-8">

                        <ErrorMessage
                            message={error}
                            onRetry={
                                loadJobs
                            }
                        />

                    </div>

                )}


                {/* Success */}

                {success && !loading && (

                    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 flex items-center gap-3">

                        <Check
                            size={20}
                            className="text-green-600"
                        />

                        <p className="text-green-700 font-medium">
                            {success}
                        </p>

                    </div>

                )}


                {/* Job Information */}

                {job && !loading && (

                    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">

                        <div className="flex flex-col md:flex-row justify-between gap-6">

                            <div>

                                <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wide">
                                    Interview Preparation
                                </p>


                                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                    {job.title}
                                </h2>


                                <div className="flex flex-wrap gap-6 mt-4 text-gray-500">

                                    {(job.company_name ||
                                        job.company) && (

                                            <span className="flex items-center gap-2">

                                                <Building2
                                                    size={18}
                                                />

                                                {job.company_name ||
                                                    job.company}

                                            </span>

                                        )}


                                    {job.location && (

                                        <span className="flex items-center gap-2">

                                            <MapPin
                                                size={18}
                                            />

                                            {job.location}

                                        </span>

                                    )}

                                </div>

                            </div>


                            {questions.length > 0 && (

                                <div className="bg-indigo-50 rounded-2xl px-6 py-5 text-center">

                                    <p className="text-sm text-indigo-600 font-medium">
                                        AI Questions
                                    </p>


                                    <p className="text-4xl font-bold text-indigo-700 mt-1">
                                        {questions.length}
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                )}


                {/* Questions */}

                {questions.length > 0 &&
                    !loading && (

                        <>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                                <div>

                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Personalized Interview Questions
                                    </h2>


                                    <p className="text-gray-500 mt-1">
                                        Practice these questions before your interview.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleRegenerate
                                    }
                                    disabled={
                                        regenerating ||
                                        loading
                                    }
                                    className="bg-white border border-indigo-200 text-indigo-600 px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                >

                                    {regenerating ? (

                                        <>

                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />

                                            Regenerating...

                                        </>

                                    ) : (

                                        <>

                                            <RefreshCw
                                                size={18}
                                            />

                                            Regenerate

                                        </>

                                    )}

                                </button>

                            </div>


                            <div className="space-y-5">

                                {questions.map(
                                    (
                                        question,
                                        index
                                    ) => (

                                        <div
                                            key={`${index}-${question}`}
                                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 flex justify-between items-start gap-6"
                                        >

                                            <div className="flex gap-5">

                                                <div className="w-12 h-12 shrink-0 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">

                                                    {index + 1}

                                                </div>


                                                <div>

                                                    <p className="text-gray-800 leading-7">
                                                        {question}
                                                    </p>

                                                </div>

                                            </div>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    copyQuestion(
                                                        question,
                                                        index
                                                    )
                                                }
                                                className="shrink-0 bg-slate-100 hover:bg-indigo-100 rounded-xl p-3 transition"
                                                title="Copy question"
                                            >

                                                {copiedIndex ===
                                                    index ? (

                                                    <Check
                                                        className="text-green-600"
                                                        size={20}
                                                    />

                                                ) : (

                                                    <Clipboard
                                                        className="text-gray-600"
                                                        size={20}
                                                    />

                                                )}

                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                        </>

                    )}


                {/* Empty State */}

                {!loading &&
                    !job &&
                    questions.length === 0 && (

                        <div className="bg-white rounded-3xl shadow-lg">

                            <EmptyState
                                title="No Interview Questions Yet"
                                message="Select a job above. Existing questions will be loaded automatically; otherwise, AI will generate a personalized question set."
                            />

                        </div>

                    )}


                {/* Generated Time */}

                {questions.length > 0 &&
                    createdAt && (

                        <p className="text-sm text-gray-400 text-center mt-8">

                            AI questions generated on{" "}

                            {new Date(
                                createdAt
                            ).toLocaleString()}

                        </p>

                    )}

            </div>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Job Select Icon
|--------------------------------------------------------------------------
*/

const BriefcaseSelectIcon = () => (
    <div className="absolute left-4 top-4 text-gray-400 pointer-events-none">

        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <rect
                width="20"
                height="14"
                x="2"
                y="7"
                rx="2"
                ry="2"
            />

            <path
                d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
            />

        </svg>

    </div>
);


export default InterviewQuestions;