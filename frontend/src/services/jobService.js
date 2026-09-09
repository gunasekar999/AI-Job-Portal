import api from "../api/axios";


/*
|--------------------------------------------------------------------------
| Get All Public Jobs
|--------------------------------------------------------------------------
*/

export const getJobs = async (
    params = {}
) => {

    const response =
        await api.get(
            "jobs/",
            {
                params,
            }
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Single Job
|--------------------------------------------------------------------------
*/

export const getJob = async (
    id
) => {

    const response =
        await api.get(
            `jobs/${id}/`
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
| The backend automatically attaches the
| candidate's latest saved Resume AI file.
|
*/

export const applyForJob = async (
    jobId
) => {

    const formData =
        new FormData();

    formData.append(
        "job",
        jobId
    );

    const response =
        await api.post(
            "applications/",
            formData
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Recruiter's Jobs
|--------------------------------------------------------------------------
*/

export const getRecruiterJobs =
    async () => {

        const response =
            await api.get(
                "jobs/recruiter/"
            );

        return response.data;
    };


/*
|--------------------------------------------------------------------------
| Create Job
|--------------------------------------------------------------------------
*/

export const createJob = async (
    jobData
) => {

    const response =
        await api.post(
            "jobs/",
            jobData
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Job
|--------------------------------------------------------------------------
*/

export const updateJob = async (
    jobId,
    jobData
) => {

    const response =
        await api.patch(
            `jobs/${jobId}/`,
            jobData
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Job
|--------------------------------------------------------------------------
*/

export const deleteJob = async (
    jobId
) => {

    const response =
        await api.delete(
            `jobs/${jobId}/`
        );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Get All Jobs For Admin
|--------------------------------------------------------------------------
*/

export const getAdminJobs = async () => {

    const response =
        await api.get(
            "jobs/admin/"
        );

    return response.data;
};