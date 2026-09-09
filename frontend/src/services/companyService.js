import api from "../api/axios";


/*
|--------------------------------------------------------------------------
| Get All Companies
|--------------------------------------------------------------------------
*/

export const getCompanies = async () => {
    const response = await api.get(
        "companies/"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get My Companies
|--------------------------------------------------------------------------
|
| GET /api/v1/companies/my/
|
| Returns companies created by the
| currently authenticated recruiter.
|
*/

export const getMyCompanies = async () => {
    const response = await api.get(
        "companies/my/"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Single Company
|--------------------------------------------------------------------------
*/

export const getCompany = async (id) => {
    const response = await api.get(
        `companies/${id}/`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Create Company
|--------------------------------------------------------------------------
*/

export const createCompany = async (
    companyData
) => {
    const response = await api.post(
        "companies/",
        companyData
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Company
|--------------------------------------------------------------------------
*/

export const updateCompany = async (
    id,
    companyData
) => {
    const response = await api.patch(
        `companies/${id}/`,
        companyData
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Company
|--------------------------------------------------------------------------
*/

export const deleteCompany = async (
    id
) => {
    const response = await api.delete(
        `companies/${id}/`
    );

    return response.data;
};