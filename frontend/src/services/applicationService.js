import api from "../api/axios";


/*
|--------------------------------------------------------------------------
| Get My Applications
|--------------------------------------------------------------------------
*/

export const getMyApplications = async () => {
    const response = await api.get(
        "applications/"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Single Application
|--------------------------------------------------------------------------
*/

export const getApplication = async (
    id
) => {
    const response = await api.get(
        `applications/${id}/`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Apply For Job
|--------------------------------------------------------------------------
|
| POST /api/v1/applications/
|
| Uses FormData because the backend accepts
| MultiPartParser and FormParser.
|
*/

export const applyForJob = async (
    jobId,
    applicationData = {}
) => {

    const formData = new FormData();

    formData.append(
        "job",
        jobId
    );

    if (
        applicationData.cover_letter
    ) {
        formData.append(
            "cover_letter",
            applicationData.cover_letter
        );
    }

    if (
        applicationData.resume
    ) {
        formData.append(
            "resume",
            applicationData.resume
        );
    }

    const response = await api.post(
        "applications/",
        formData
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Withdraw Application
|--------------------------------------------------------------------------
|
| DELETE /api/v1/applications/<id>/withdraw/
|
*/

export const withdrawApplication = async (
    id
) => {

    const response = await api.delete(
        `applications/${id}/withdraw/`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Recruiter's Applications
|--------------------------------------------------------------------------
|
| GET /api/v1/applications/recruiter/
|
*/

export const getRecruiterApplications =
    async () => {

        const response = await api.get(
            "applications/recruiter/"
        );

        return response.data;
    };


/*
|--------------------------------------------------------------------------
| Update Application Status
|--------------------------------------------------------------------------
|
| PATCH /api/v1/applications/<id>/status/
|
*/

export const updateApplicationStatus = async (
    applicationId,
    status
) => {

    const response = await api.patch(
        `applications/${applicationId}/status/`,
        {
            status,
        }
    );

    return response.data;
};