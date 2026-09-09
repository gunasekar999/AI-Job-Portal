import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import {
    getMyProfile,
} from "../../services/profileServices";

import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";


const RoleRoute = ({
    children,
    allowedRoles = [],
}) => {
    const [role, setRole] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const profile =
                await getMyProfile();

            setRole(
                profile.role
            );

        } catch (error) {
            console.error(
                "Unable to verify user role:",
                error
            );

            setRole(null);

            setError(
                error?.response?.data?.detail ||
                "Unable to verify your account access."
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadProfile();
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <LoadingSpinner
                text="Checking access..."
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Authentication / Role Verification Error
    |--------------------------------------------------------------------------
    */

    if (error) {
        return (
            <ErrorMessage
                message={error}
                onRetry={loadProfile}
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | No Valid Role
    |--------------------------------------------------------------------------
    */

    if (!role) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Unauthorized Role
    |--------------------------------------------------------------------------
    */

    if (
        !allowedRoles.includes(role)
    ) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Authorized
    |--------------------------------------------------------------------------
    */

    return children;
};


export default RoleRoute;