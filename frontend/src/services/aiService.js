import api from "../api/axios";


/*
|--------------------------------------------------------------------------
| Get Existing Job Match
|--------------------------------------------------------------------------
*/

export const getJobMatch = async (jobId) => {
    const response = await api.get(
        `ai/job-match/${jobId}/`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Generate New Job Match
|--------------------------------------------------------------------------
*/

export const generateJobMatch = async (
    jobId,
    candidateProfile
) => {
    const response = await api.post(
        "ai/job-match/",
        {
            job_id: jobId,
            candidate_profile: candidateProfile,
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Regenerate Job Match
|--------------------------------------------------------------------------
*/

export const regenerateJobMatch = async (
    jobId,
    candidateProfile
) => {
    const response = await api.post(
        `ai/job-match/${jobId}/regenerate/`,
        {
            job_id: jobId,
            candidate_profile: candidateProfile,
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get My AI Matches
|--------------------------------------------------------------------------
*/

export const getMyAIMatches = async () => {
    const response = await api.get(
        "ai/my-matches/"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Upload Resume
|--------------------------------------------------------------------------
*/

export const uploadResume = async (
    formData
) => {
    const response = await api.post(
        "ai/resume-score/",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Existing Resume Analysis
|--------------------------------------------------------------------------
|
| GET /api/v1/ai/resume-score/
|
| Retrieves the saved resume analysis.
| Does NOT call OpenAI.
|
*/

export const getResumeAnalysis = async () => {
    const response = await api.get(
        "ai/resume-score/"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Job Recommendations
|--------------------------------------------------------------------------
*/

export const getJobRecommendations = async () => {
    const response = await api.post(
        "ai/recommendations/"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Existing Interview Questions
|--------------------------------------------------------------------------
*/

export const getInterviewQuestions = async (
    jobId
) => {
    const response = await api.get(
        `ai/interview-questions/${jobId}/`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Generate Interview Questions
|--------------------------------------------------------------------------
*/

export const generateInterviewQuestions = async (
    jobId
) => {
    const response = await api.post(
        "ai/interview-questions/",
        {
            job_id: jobId,
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Regenerate Interview Questions
|--------------------------------------------------------------------------
*/

export const regenerateInterviewQuestions = async (
    jobId
) => {
    const response = await api.post(
        `ai/interview-questions/${jobId}/regenerate/`,
        {
            job_id: jobId,
        }
    );

    return response.data;
};