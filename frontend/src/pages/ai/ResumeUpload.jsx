import { useEffect, useState } from "react";

import {
    Upload,
    FileText,
    Brain,
    Award,
    CheckCircle2,
    AlertTriangle,
    Lightbulb,
    HelpCircle,
    Loader2,
} from "lucide-react";

import {
    uploadResume,
    getResumeAnalysis,
} from "../../services/aiService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";


const ResumeUpload = () => {
    const [resume, setResume] = useState(null);

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Saved Resume Analysis
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const loadSavedAnalysis = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getResumeAnalysis();

                if (response) {
                    setResult(response);
                }
            } catch (error) {
                console.error(
                    "Failed to load saved resume analysis:",
                    error
                );

                /*
                |--------------------------------------------------------------
                | 404 means the candidate has not uploaded a resume yet.
                | This is not treated as a page error.
                |--------------------------------------------------------------
                */

                if (error?.response?.status !== 404) {
                    setError(
                        error?.response?.data?.detail ||
                        "Failed to load saved resume analysis."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadSavedAnalysis();
    }, []);


    /*
    |--------------------------------------------------------------------------
    | File Selection
    |--------------------------------------------------------------------------
    */

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;

        setResume(file);
        setError("");
        setSuccess("");
        setResult(null);


        if (!file) {
            return;
        }


        /*
        |--------------------------------------------------------------
        | Validate File Type
        |--------------------------------------------------------------
        */

        const fileName = file.name.toLowerCase();


        if (
            !fileName.endsWith(".pdf") &&
            !fileName.endsWith(".docx")
        ) {
            setResume(null);

            setError(
                "Only PDF and DOCX resumes are supported."
            );

            return;
        }


        /*
        |--------------------------------------------------------------
        | Validate File Size
        |--------------------------------------------------------------
        */

        const maxSize = 10 * 1024 * 1024;


        if (file.size > maxSize) {
            setResume(null);

            setError(
                "Resume file size must be less than 10 MB."
            );

            return;
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Upload and Analyze Resume
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");


        if (!resume) {
            setError(
                "Please select a resume before analyzing."
            );

            return;
        }


        try {
            setLoading(true);

            const formData = new FormData();

            formData.append(
                "resume",
                resume
            );


            const response = await uploadResume(
                formData
            );


            /*
            |--------------------------------------------------------------
            | Save AI Analysis in React State
            |--------------------------------------------------------------
            */

            setResult(response);

            setSuccess(
                "Resume analyzed successfully."
            );

            /*
            |--------------------------------------------------------------
            | Clear selected browser file after successful upload.
            | The saved resume is now represented by result.resume_name.
            |--------------------------------------------------------------
            */

            setResume(null);

        } catch (error) {
            console.error(
                "Resume analysis error:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Resume analysis failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Full Page Loading
    |--------------------------------------------------------------------------
    */

    if (
        loading &&
        !result
    ) {
        return (
            <LoadingSpinner
                text="AI is analyzing your resume..."
            />
        );
    }


    return (
        <div className="min-h-screen bg-slate-100">

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Header */}

                <div className="mb-10">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">

                            <Brain size={30} />

                        </div>


                        <div>

                            <h1 className="text-4xl font-bold text-gray-900">
                                AI Resume Analyzer
                            </h1>

                            <p className="text-gray-600 mt-1">
                                Get intelligent feedback about your resume.
                            </p>

                        </div>

                    </div>


                    <p className="text-gray-600 mt-4 max-w-3xl leading-7">
                        Upload your resume and receive an AI-powered
                        analysis with score, strengths, missing skills,
                        improvements and interview questions.
                    </p>

                </div>


                {/* Error */}

                {error && (
                    <div className="mb-6">

                        <ErrorMessage
                            message={error}
                        />

                    </div>
                )}


                {/* Success */}

                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-4 flex items-center gap-3">

                        <CheckCircle2
                            size={20}
                        />

                        <span className="font-medium">
                            {success}
                        </span>

                    </div>
                )}


                {/* Upload Card */}

                <div className="bg-white rounded-3xl shadow-xl p-8">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >

                        <label
                            htmlFor="resume"
                            className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition ${resume
                                ? "border-green-400 bg-green-50"
                                : "border-blue-300 hover:border-blue-600 hover:bg-blue-50"
                                }`}
                        >

                            <Upload
                                className={
                                    resume
                                        ? "text-green-600 mb-5"
                                        : "text-blue-600 mb-5"
                                }
                                size={50}
                            />


                            <h2 className="text-2xl font-semibold text-gray-800">

                                {resume
                                    ? "Resume Selected"
                                    : "Upload Resume"}

                            </h2>


                            <p className="text-gray-500 mt-2">
                                PDF or DOCX files only • Maximum 10 MB
                            </p>


                            {/* Newly Selected Resume */}

                            {resume && (
                                <div className="mt-6 flex items-center gap-3 text-green-600 font-medium bg-white px-5 py-3 rounded-xl shadow-sm">

                                    <FileText
                                        size={22}
                                    />

                                    <span className="break-all">
                                        {resume.name}
                                    </span>

                                </div>
                            )}


                            {/* Previously Saved Resume */}

                            {!resume && result?.resume_name && (
                                <div className="mt-6 flex items-center gap-3 text-blue-600 font-medium bg-blue-50 px-5 py-3 rounded-xl">

                                    <FileText
                                        size={22}
                                    />

                                    <span className="break-all">
                                        Saved Resume: {result.resume_name}
                                    </span>

                                </div>
                            )}


                            <input
                                id="resume"
                                type="file"
                                accept=".pdf,.docx"
                                hidden
                                onChange={handleFileChange}
                            />

                        </label>


                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !resume
                            }
                            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl text-lg font-semibold hover:opacity-95 transition flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >

                            {loading ? (
                                <>
                                    <Loader2
                                        className="animate-spin"
                                        size={22}
                                    />

                                    AI Analyzing Resume...
                                </>
                            ) : (
                                <>
                                    <Brain
                                        size={22}
                                    />

                                    Analyze Resume
                                </>
                            )}

                        </button>


                    </form>

                </div>


                {/* Results */}

                {!result && !loading && (

                    <div className="mt-8 bg-white rounded-3xl shadow-lg">

                        <EmptyState
                            title="No Resume Analysis Yet"
                            message="Upload your resume above to receive your AI-powered resume analysis."
                        />

                    </div>

                )}


                {/* AI Analysis Result */}

                {result && (

                    <div className="mt-12 space-y-8">

                        {/* Score */}

                        <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl text-white p-8 shadow-xl">

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-lg">
                                        AI Resume Score
                                    </p>

                                    <h2 className="text-6xl font-bold mt-2">
                                        {result.ai_score}
                                    </h2>

                                    <p className="text-blue-100 mt-2">
                                        Based on your resume content and profile.
                                    </p>

                                </div>


                                <Award
                                    size={70}
                                />

                            </div>

                        </div>


                        {/* Summary */}

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold flex items-center gap-3">

                                <Brain
                                    className="text-indigo-600"
                                />

                                AI Summary

                            </h2>


                            <p className="mt-4 text-gray-700 leading-8 whitespace-pre-line">

                                {result.ai_summary ||
                                    "No summary available."}

                            </p>

                        </div>


                        {/* Skills */}

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold mb-6">
                                Skills Detected
                            </h2>


                            {result.extracted_skills?.length ? (

                                <div className="flex flex-wrap gap-3">

                                    {result.extracted_skills.map(
                                        (
                                            skill,
                                            index
                                        ) => (

                                            <span
                                                key={`${skill}-${index}`}
                                                className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-medium"
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="text-gray-500">
                                    No skills were detected.
                                </p>

                            )}

                        </div>


                        {/* Strengths + Missing Skills */}

                        <div className="grid lg:grid-cols-2 gap-8">

                            {/* Strengths */}

                            <div className="bg-white rounded-3xl shadow-lg p-8">

                                <h2 className="text-2xl font-bold flex items-center gap-2">

                                    <CheckCircle2
                                        className="text-green-600"
                                    />

                                    Strengths

                                </h2>


                                {result.strengths?.length ? (

                                    <ul className="mt-6 space-y-3">

                                        {result.strengths.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <li
                                                    key={index}
                                                    className="flex gap-3 text-gray-700"
                                                >

                                                    <CheckCircle2
                                                        className="text-green-500 mt-1 shrink-0"
                                                        size={18}
                                                    />

                                                    <span>
                                                        {item}
                                                    </span>

                                                </li>

                                            )
                                        )}

                                    </ul>

                                ) : (

                                    <p className="mt-6 text-gray-500">
                                        No strengths were returned.
                                    </p>

                                )}

                            </div>


                            {/* Missing Skills */}

                            <div className="bg-white rounded-3xl shadow-lg p-8">

                                <h2 className="text-2xl font-bold flex items-center gap-2">

                                    <AlertTriangle
                                        className="text-yellow-500"
                                    />

                                    Missing Skills

                                </h2>


                                {result.missing_skills?.length ? (

                                    <ul className="mt-6 space-y-3">

                                        {result.missing_skills.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <li
                                                    key={index}
                                                    className="flex gap-3 text-gray-700"
                                                >

                                                    <AlertTriangle
                                                        className="text-yellow-500 mt-1 shrink-0"
                                                        size={18}
                                                    />

                                                    <span>
                                                        {item}
                                                    </span>

                                                </li>

                                            )
                                        )}

                                    </ul>

                                ) : (

                                    <p className="mt-6 text-gray-500">
                                        No missing skills were identified.
                                    </p>

                                )}

                            </div>

                        </div>


                        {/* Improvements */}

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold flex items-center gap-3">

                                <Lightbulb
                                    className="text-orange-500"
                                />

                                AI Suggestions

                            </h2>


                            {result.improvements?.length ? (

                                <ul className="mt-6 space-y-3">

                                    {result.improvements.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <li
                                                key={index}
                                                className="flex gap-3 text-gray-700"
                                            >

                                                <Lightbulb
                                                    className="text-orange-500 mt-1 shrink-0"
                                                    size={18}
                                                />

                                                <span>
                                                    {item}
                                                </span>

                                            </li>

                                        )
                                    )}

                                </ul>

                            ) : (

                                <p className="mt-6 text-gray-500">
                                    No improvement suggestions were returned.
                                </p>

                            )}

                        </div>


                        {/* Interview Questions */}

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold flex items-center gap-3">

                                <HelpCircle
                                    className="text-purple-600"
                                />

                                Interview Questions

                            </h2>


                            {result.interview_questions?.length ? (

                                <ol className="list-decimal ml-6 mt-6 space-y-4 text-gray-700">

                                    {result.interview_questions.map(
                                        (
                                            question,
                                            index
                                        ) => (

                                            <li
                                                key={index}
                                                className="pl-2"
                                            >
                                                {question}
                                            </li>

                                        )
                                    )}

                                </ol>

                            ) : (

                                <p className="mt-6 text-gray-500">
                                    No interview questions were generated.
                                </p>

                            )}

                        </div>


                    </div>

                )}


            </div>

        </div>
    );
};


export default ResumeUpload;