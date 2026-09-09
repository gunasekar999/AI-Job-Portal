import api from "../api/axios";


/*
|--------------------------------------------------------------------------
| Get Admin Users
|--------------------------------------------------------------------------
*/

export const getAdminUsers = async () => {

    const response = await api.get(
        "auth/admin/users/"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Admin User
|--------------------------------------------------------------------------
|
| Currently used to activate/deactivate
| a user account.
|
*/

export const updateAdminUser = async (
    userId,
    data
) => {

    const response = await api.patch(
        `auth/admin/users/${userId}/`,
        data
    );

    return response.data;
};