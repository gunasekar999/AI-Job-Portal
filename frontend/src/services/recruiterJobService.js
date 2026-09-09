import api from "../api/axios";

export const getRecruiterJobs = async () => {
    const response = await api.get("jobs/");
    return response.data;
};

export const createJob = async (jobData) => {
    const response = await api.post(
        "jobs/",
        jobData
    );

    return response.data;
};

export const updateJob = async (id, jobData) => {
    const response = await api.patch(
        `jobs/${id}/`,
        jobData
    );

    return response.data;
};

export const deleteJob = async (id) => {
    const response = await api.delete(
        `jobs/${id}/`
    );

    return response.data;
};