import api from "../api/axios";

export const getRecruiterApplications = async () => {
    const response = await api.get(
        "applications/recruiter/"
    );

    return response.data;
};

export const updateApplicationStatus = async (
    id,
    status
) => {
    const response = await api.patch(
        `applications/${id}/status/`,
        {
            status,
        }
    );

    return response.data;
};