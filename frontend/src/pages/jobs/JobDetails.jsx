import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Briefcase,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
    Send,
    Sparkles,
} from "lucide-react";

import {
    getJob,
    applyForJob,
} from "../../services/jobService";

import {
    getJobMatch,
    generateJobMatch,
    regenerateJobMatch,
} from "../../services/aiService";

import {
    getMyProfile,
} from "../../services/profileServices";

import {
    getMyApplications,
} from "../../services/applicationService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

import AIMatchCard from "../../components/layout/jobs/AIMatchCard";


const JobDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    const [job, setJob] =
        useState(null);

    const [profile, setProfile] =
        useState(null);

    const [alreadyApplied, setAlreadyApplied] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [applying, setApplying] =
        useState(false);

    const [aiLoading, setAiLoading] =
        useState(false);

    const [aiResult, setAiResult] =
        useState(null);

    const [aiError, setAiError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Page Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadData();
    }, [id]);


    const loadData = async () => {

        try {

            setLoading(true);
            setError("");
            setMessage("");


            /*
            |--------------------------------------------------------------------------
            | Load Job + Profile
            |--------------------------------------------------------------------------
            */

            const [
                jobData,
                profileData,
            ] = await Promise.all([
                getJob(id),
                getMyProfile(),
            ]);


            setJob(
                jobData
            );


            setProfile(
                profileData
            );


            /*
            |--------------------------------------------------------------------------
            | Candidate Application Check
            |--------------------------------------------------------------------------
            |
            | GET /applications/ is candidate-only.
            |
            | Recruiters must NOT call this endpoint.
            |
            */

            if (
                profileData.role === "candidate"
            ) {

                try {

                    const applicationsData =
                        await getMyApplications();


                    const applications =
                        Array.isArray(
                            applicationsData
                        )
                            ? applicationsData
                            : applicationsData?.results || [];


                    const hasApplied =
                        applications.some(
                            (application) =>
                                String(
                                    application.job_id ??
                                    application.job?.id ??
                                    application.job
                                ) === String(id)
                        );


                    setAlreadyApplied(
                        hasApplied
                    );


                    if (hasApplied) {

                        setMessage(
                            "You have already applied for this job."
                        );
                    }

                } catch (applicationError) {

                    console.error(
                        "Unable to check application status:",
                        applicationError
                    );

                }

            } else {

                /*
                |--------------------------------------------------------------------------
                | Recruiter / Admin
                |--------------------------------------------------------------------------
                */

                setAlreadyApplied(
                    false
                );
            }


            /*
            |--------------------------------------------------------------------------
            | Load Existing AI Match
            |--------------------------------------------------------------------------
            |
            | AI Job Match is candidate-only.
            |
            */

            if (
                profileData.role === "candidate"
            ) {

                await loadExistingAIResult();

            } else {

                setAiResult(
                    null
                );
            }

        } catch (err) {

            console.error(
                err
            );


            setError(
                err?.response?.data?.detail ||
                "Unable to load job details. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Load Existing AI Result
    |--------------------------------------------------------------------------
    */

    const loadExistingAIResult =
        async () => {

            try {

                const result =
                    await getJobMatch(id);


                setAiResult(
                    result
                );

            } catch (err) {

                /*
                |--------------------------------------------------------------------------
                | 404 means no AI result exists yet.
                |--------------------------------------------------------------------------
                */

                if (
                    err?.response?.status === 404
                ) {

                    setAiResult(
                        null
                    );

                    return;
                }


                console.error(
                    "AI result loading error:",
                    err
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Build Candidate Profile
    |--------------------------------------------------------------------------
    */

    const buildCandidateProfile =
        () => {

            return {

                headline:
                    profile?.headline ||
                    "",

                bio:
                    profile?.bio ||
                    "",

                skills:
                    profile?.skills ||
                    [],

                experience:
                    profile?.experience ||
                    [],

                education:
                    profile?.education ||
                    [],

                certifications:
                    profile?.certifications ||
                    [],
            };
        };


    /*
    |--------------------------------------------------------------------------
    | Apply For Job
    |--------------------------------------------------------------------------
    */

    const handleApply =
        async () => {

            if (
                alreadyApplied
            ) {
                return;
            }


            try {

                setApplying(true);
                setMessage("");
                setError("");


                await applyForJob(
                    id
                );


                setAlreadyApplied(
                    true
                );


                setMessage(
                    "Application submitted successfully."
                );

            } catch (err) {

                console.error(
                    err
                );


                const errorMessage =
                    err?.response?.data?.detail ||
                    err?.response?.data?.error ||
                    err?.response?.data?.job?.[0] ||
                    "Unable to submit application.";


                if (
                    errorMessage
                        .toLowerCase()
                        .includes("already")
                ) {

                    setAlreadyApplied(
                        true
                    );
                }


                setError(
                    errorMessage
                );

            } finally {

                setApplying(false);
            }
        };


    /*
    |--------------------------------------------------------------------------
    | AI Job Match
    |--------------------------------------------------------------------------
    */

    const handleAIAnalysis =
        async () => {

            if (!profile) {

                setAiError(
                    "Candidate profile is not available."
                );

                return;
            }


            try {

                setAiLoading(true);
                setAiError("");


                const candidateProfile =
                    buildCandidateProfile();


                let result;


                /*
                |--------------------------------------------------------------------------
                | Existing Result → Regenerate
                |--------------------------------------------------------------------------
                */

                if (
                    aiResult
                ) {

                    result =
                        await regenerateJobMatch(
                            id,
                            candidateProfile
                        );

                } else {

                    /*
                    |--------------------------------------------------------------------------
                    | No Existing Result → Generate
                    |--------------------------------------------------------------------------
                    */

                    result =
                        await generateJobMatch(
                            id,
                            candidateProfile
                        );
                }


                setAiResult(
                    result
                );

            } catch (err) {

                console.error(
                    "AI generation error:",
                    err
                );


                setAiError(
                    err?.response?.data?.detail ||
                    "Unable to generate AI match."
                );

            } finally {

                setAiLoading(false);
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (
        loading
    ) {

        return (
            <LoadingSpinner
                text="Loading job details..."
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (
        error &&
        !job
    ) {

        return (
            <ErrorMessage
                message={error}
                onRetry={loadData}
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | No Job
    |--------------------------------------------------------------------------
    */

    if (!job) {

        return (
            <ErrorMessage
                message="Job details could not be found."
                onRetry={loadData}
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Company Information
    |--------------------------------------------------------------------------
    */

    const companyName =
        job.company_name ||
        job.company?.company_name ||
        "Company";


    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Back Button */}

            <button
                type="button"
                onClick={() =>
                    navigate(
                        "/jobs"
                    )
                }
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition"
            >

                <ArrowLeft
                    size={19}
                />

                Back to Jobs

            </button>


            {/* Job Header */}

            <section className="overflow-hidden rounded-3xl bg-white shadow-xl">

                <div className="h-40 bg-linear-to-r from-blue-700 via-indigo-600 to-purple-600" />


                <div className="px-8 pb-8">

                    <div className="-mt-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

                        <div className="flex items-end gap-5">

                            <div className="w-28 h-28 rounded-3xl bg-white shadow-xl border-4 border-white flex items-center justify-center text-blue-600">

                                <Building2
                                    size={48}
                                />

                            </div>


                            <div className="pb-2">

                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                    {job.title}
                                </h1>


                                <p className="text-lg text-gray-500 mt-2">
                                    {companyName}
                                </p>

                            </div>

                        </div>


                        {/* Apply Button */}

                        {profile?.role === "candidate" && (

                            <button
                                type="button"
                                onClick={
                                    handleApply
                                }
                                disabled={
                                    applying ||
                                    alreadyApplied
                                }
                                className="px-8 py-4 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                            >

                                {applying ? (

                                    <>

                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                                        Applying...

                                    </>

                                ) : alreadyApplied ? (

                                    <>

                                        <CheckCircle2
                                            size={20}
                                        />

                                        Applied

                                    </>

                                ) : (

                                    <>

                                        <Send
                                            size={20}
                                        />

                                        Apply Now

                                    </>

                                )}

                            </button>

                        )}

                    </div>

                </div>

            </section>


            {/* Success Message */}

            {message && (

                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl">

                    <CheckCircle2
                        size={20}
                    />

                    {message}

                </div>
            )}


            {/* Error Message */}

            {error && (

                <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">

                    {error}

                </div>
            )}


            {/* Job Information */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

                {job.location && (

                    <InfoCard
                        icon={
                            <MapPin
                                size={22}
                            />
                        }
                        title="Location"
                        value={
                            job.location
                        }
                    />

                )}


                {job.job_type && (

                    <InfoCard
                        icon={
                            <Briefcase
                                size={22}
                            />
                        }
                        title="Job Type"
                        value={
                            job.job_type
                        }
                    />

                )}


                {job.experience && (

                    <InfoCard
                        icon={
                            <Clock3
                                size={22}
                            />
                        }
                        title="Experience"
                        value={
                            job.experience
                        }
                    />

                )}


                {job.salary && (

                    <InfoCard
                        icon={
                            <Sparkles
                                size={22}
                            />
                        }
                        title="Salary"
                        value={
                            formatSalary(
                                job.salary
                            )
                        }
                    />

                )}


                {job.deadline && (

                    <InfoCard
                        icon={
                            <CalendarDays
                                size={22}
                            />
                        }
                        title="Deadline"
                        value={
                            formatDate(
                                job.deadline
                            )
                        }
                    />

                )}

            </div>


            {/* Main Content */}

            <div className="grid xl:grid-cols-3 gap-8">

                {/* Left Content */}

                <div className="xl:col-span-2 space-y-8">

                    {/* Job Description */}

                    <section className="bg-white rounded-3xl shadow-lg p-8">

                        <h2 className="text-2xl font-bold text-gray-900">
                            Job Description
                        </h2>


                        <div className="mt-5 text-gray-600 leading-8 whitespace-pre-line">

                            {job.description ||
                                "No job description provided."}

                        </div>

                    </section>


                    {/* Job Requirements */}

                    <section className="bg-white rounded-3xl shadow-lg p-8">

                        <h2 className="text-2xl font-bold text-gray-900">
                            Job Requirements
                        </h2>


                        <div className="mt-5 space-y-4">

                            <RequirementItem
                                label="Experience"
                                value={
                                    job.experience ||
                                    "Not specified"
                                }
                            />


                            <RequirementItem
                                label="Job Type"
                                value={
                                    job.job_type ||
                                    "Not specified"
                                }
                            />


                            <RequirementItem
                                label="Location"
                                value={
                                    job.location ||
                                    "Not specified"
                                }
                            />

                        </div>

                    </section>

                </div>


                {/* Right Sidebar */}

                <aside className="space-y-6">

                    {/* AI Job Match */}

                    {profile?.role === "candidate" && (

                        <AIMatchCard
                            result={
                                aiResult
                            }
                            loading={
                                aiLoading
                            }
                            error={
                                aiError
                            }
                            onAnalyze={
                                handleAIAnalysis
                            }
                        />

                    )}


                    {/* Company Information */}

                    <div className="bg-white rounded-3xl shadow-lg p-7">

                        <h2 className="text-xl font-bold">
                            About the Company
                        </h2>


                        <div className="flex items-center gap-3 mt-6">

                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                <Building2
                                    size={24}
                                />

                            </div>


                            <div>

                                <h3 className="font-bold">
                                    {companyName}
                                </h3>


                                <p className="text-sm text-gray-500">
                                    Hiring Company
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Candidate Apply CTA */}

                    {profile?.role === "candidate" && (

                        <div className="rounded-3xl bg-linear-to-br from-indigo-600 to-blue-700 text-white p-7 shadow-xl">

                            <Sparkles
                                size={30}
                            />


                            <h2 className="text-2xl font-bold mt-5">
                                Interested in this role?
                            </h2>


                            <p className="text-blue-100 mt-3 leading-6">
                                Apply now and let recruiters know you're interested.
                            </p>


                            <button
                                type="button"
                                onClick={
                                    handleApply
                                }
                                disabled={
                                    applying ||
                                    alreadyApplied
                                }
                                className="w-full mt-6 bg-white text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >

                                {alreadyApplied
                                    ? "Application Submitted"
                                    : applying
                                        ? "Submitting..."
                                        : "Apply for this Job"}

                            </button>

                        </div>

                    )}

                </aside>

            </div>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Information Card
|--------------------------------------------------------------------------
*/

const InfoCard = ({
    icon,
    title,
    value,
}) => (

    <div className="bg-white rounded-2xl shadow-md p-5">

        <div className="w-11 h-11 rounded-xl bg-slate-100 text-gray-600 flex items-center justify-center">

            {icon}

        </div>


        <p className="text-sm text-gray-500 mt-4">
            {title}
        </p>


        <p className="font-bold text-gray-900 mt-1 capitalize">
            {value}
        </p>

    </div>
);


/*
|--------------------------------------------------------------------------
| Requirement Item
|--------------------------------------------------------------------------
*/

const RequirementItem = ({
    label,
    value,
}) => (

    <div className="flex items-start gap-3">

        <CheckCircle2
            size={20}
            className="text-green-500 mt-1 shrink-0"
        />


        <div>

            <p className="font-semibold text-gray-800">
                {label}
            </p>


            <p className="text-gray-600 mt-1">
                {value}
            </p>

        </div>

    </div>
);


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


/*
|--------------------------------------------------------------------------
| Salary Formatter
|--------------------------------------------------------------------------
*/

const formatSalary = (
    salary
) => {

    if (
        salary === null ||
        salary === undefined ||
        salary === ""
    ) {
        return "Not specified";
    }


    const numericSalary =
        Number(salary);


    if (
        Number.isNaN(
            numericSalary
        )
    ) {
        return salary;
    }


    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }
    ).format(
        numericSalary
    );
};


export default JobDetails;