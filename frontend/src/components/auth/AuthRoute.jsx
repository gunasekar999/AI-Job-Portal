import { Navigate } from "react-router-dom";


const AuthRoute = ({ children }) => {
    const accessToken =
        localStorage.getItem("access");

    const refreshToken =
        localStorage.getItem("refresh");


    /*
    |--------------------------------------------------------------------------
    | No Authentication
    |--------------------------------------------------------------------------
    */

    if (!accessToken && !refreshToken) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Authenticated
    |--------------------------------------------------------------------------
    */

    return children;
};


export default AuthRoute;