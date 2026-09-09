import axios from "axios";


const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
});


/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
|
| Automatically attach the JWT access token.
|
*/

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("access");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
|
| If an access token expires:
|
| 1. Get refresh token
| 2. Request a new access token
| 3. Save the new access token
| 4. Retry the original request
|
| If refresh fails:
| - Clear authentication tokens
| - Redirect to login
|
*/

let isRefreshing = false;

let failedQueue = [];


const processQueue = (
    error,
    token = null
) => {

    failedQueue.forEach(
        (promise) => {

            if (error) {

                promise.reject(
                    error
                );

            } else {

                promise.resolve(
                    token
                );
            }
        }
    );


    failedQueue = [];
};


api.interceptors.response.use(

    (response) => {
        return response;
    },


    async (error) => {

        const originalRequest =
            error.config;

        const status =
            error?.response?.status;


        /*
        |--------------------------------------------------------------------------
        | 401 - Unauthorized
        |--------------------------------------------------------------------------
        */

        if (
            status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {

            const refreshToken =
                localStorage.getItem(
                    "refresh"
                );


            /*
            |--------------------------------------------------------------------------
            | No Refresh Token
            |--------------------------------------------------------------------------
            */

            if (!refreshToken) {

                localStorage.removeItem(
                    "access"
                );

                localStorage.removeItem(
                    "refresh"
                );

                localStorage.removeItem(
                    "user"
                );

                window.location.href =
                    "/login";

                return Promise.reject(
                    error
                );
            }


            /*
            |--------------------------------------------------------------------------
            | Another Request Is Already Refreshing
            |--------------------------------------------------------------------------
            */

            if (isRefreshing) {

                return new Promise(
                    (
                        resolve,
                        reject
                    ) => {

                        failedQueue.push({
                            resolve,
                            reject,
                        });

                    }
                )
                    .then(
                        (token) => {

                            originalRequest
                                .headers
                                .Authorization =
                                `Bearer ${token}`;

                            return api(
                                originalRequest
                            );
                        }
                    )
                    .catch(
                        (refreshError) => {

                            return Promise.reject(
                                refreshError
                            );
                        }
                    );
            }


            /*
            |--------------------------------------------------------------------------
            | Start Refresh
            |--------------------------------------------------------------------------
            */

            originalRequest._retry =
                true;

            isRefreshing = true;


            try {

                const response =
                    await axios.post(
                        "http://127.0.0.1:8000/api/v1/auth/refresh/",
                        {
                            refresh:
                                refreshToken,
                        }
                    );


                const newAccessToken =
                    response.data.access;


                /*
                |--------------------------------------------------------------------------
                | Save New Access Token
                |--------------------------------------------------------------------------
                */

                localStorage.setItem(
                    "access",
                    newAccessToken
                );


                /*
                |--------------------------------------------------------------------------
                | Resolve Queued Requests
                |--------------------------------------------------------------------------
                */

                processQueue(
                    null,
                    newAccessToken
                );


                /*
                |--------------------------------------------------------------------------
                | Retry Original Request
                |--------------------------------------------------------------------------
                */

                originalRequest
                    .headers
                    .Authorization =
                    `Bearer ${newAccessToken}`;


                return api(
                    originalRequest
                );

            } catch (refreshError) {

                processQueue(
                    refreshError,
                    null
                );


                localStorage.removeItem(
                    "access"
                );

                localStorage.removeItem(
                    "refresh"
                );

                localStorage.removeItem(
                    "user"
                );


                window.location.href =
                    "/login";


                return Promise.reject(
                    refreshError
                );

            } finally {

                isRefreshing =
                    false;
            }
        }


        /*
        |--------------------------------------------------------------------------
        | 403 - Forbidden
        |--------------------------------------------------------------------------
        */

        if (status === 403) {

            console.warn(
                "Access denied. You do not have permission for this action."
            );
        }


        /*
        |--------------------------------------------------------------------------
        | 404 - Not Found
        |--------------------------------------------------------------------------
        */

        if (status === 404) {

            console.warn(
                "Requested resource was not found."
            );
        }


        /*
        |--------------------------------------------------------------------------
        | 400 - Bad Request
        |--------------------------------------------------------------------------
        */

        if (status === 400) {

            console.warn(
                "Invalid request data.",
                error.response?.data
            );
        }


        /*
        |--------------------------------------------------------------------------
        | 500 - Server Error
        |--------------------------------------------------------------------------
        */

        if (status >= 500) {

            console.error(
                "Server error. Please try again later."
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Network Error
        |--------------------------------------------------------------------------
        */

        if (!error.response) {

            console.error(
                "Unable to connect to the server."
            );
        }


        return Promise.reject(
            error
        );
    }
);


export default api;