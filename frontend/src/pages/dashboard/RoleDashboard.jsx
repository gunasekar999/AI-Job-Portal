import { useEffect, useState } from "react";

import Dashboard from "./Dashboard";
import RecruiterDashboard from "./RecruiterDashboard";
import AdminDashboard from "./AdminDashboard";

import {
    getMyProfile,
} from "../../services/profileServices";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";


const RoleDashboard = () => {
    const [role, setRole] = useState(null);
    const [error, setError] = useState("");


    const loadProfile = async () => {
        try {
            setError("");
            setRole(null);

            const profile = await getMyProfile();

            setRole(profile.role);

        } catch (error) {
            console.error(
                "Unable to load user role:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to load dashboard. Please try again."
            );
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

    if (!role && !error) {
        return (
            <LoadingSpinner
                text="Loading dashboard..."
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Error
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
    | Candidate
    |--------------------------------------------------------------------------
    */

    if (role === "candidate") {
        return <Dashboard />;
    }


    /*
    |--------------------------------------------------------------------------
    | Recruiter
    |--------------------------------------------------------------------------
    */

    if (role === "recruiter") {
        return <RecruiterDashboard />;
    }


    /*
    |--------------------------------------------------------------------------
    | Admin
    |--------------------------------------------------------------------------
    */

    if (role === "admin") {
        return <AdminDashboard />;
    }


    /*
    |--------------------------------------------------------------------------
    | Unknown Role
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-[70vh] flex items-center justify-center">

            <div className="text-center bg-white rounded-3xl shadow-lg p-10 max-w-lg">

                <h1 className="text-4xl font-bold text-gray-900">
                    Dashboard Unavailable
                </h1>

                <p className="text-gray-500 mt-3">
                    Dashboard access is not configured for this role.
                </p>

            </div>

        </div>
    );
};


export default RoleDashboard;