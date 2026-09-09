import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";


const Login = () => {

    const navigate = useNavigate();


    const [formData, setFormData] =
        useState({
            email: "",
            password: "",
        });


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Handle Input
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]:
                event.target.value,
        });
    };


    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setLoading(true);


        try {

            const response =
                await api.post(
                    "auth/login/",
                    formData
                );


            localStorage.setItem(
                "access",
                response.data.access
            );


            localStorage.setItem(
                "refresh",
                response.data.refresh
            );


            localStorage.setItem(
                "user",
                JSON.stringify(
                    response.data.user
                )
            );


            navigate("/dashboard");

        } catch (error) {

            setError(
                error.response?.data?.detail ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                {/* Header */}

                <div className="text-center mb-8">

                    <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
                        AI
                    </div>


                    <h1 className="text-3xl font-bold text-slate-900 mt-5">
                        AI Job Portal
                    </h1>


                    <p className="text-slate-500 mt-2">
                        Sign in to your account
                    </p>

                </div>


                {/* Error */}

                {error && (

                    <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-600 px-4 py-3">
                        {error}
                    </div>

                )}


                {/* Form */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-5"
                >

                    {/* Email */}

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>


                        <input
                            type="email"
                            name="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter email"
                            required
                            autoComplete="email"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Password */}

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password
                        </label>


                        <input
                            type="password"
                            name="password"
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter password"
                            required
                            autoComplete="current-password"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Submit */}

                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold transition"
                    >

                        {loading
                            ? "Signing in..."
                            : "Login"}

                    </button>

                </form>

            </div>

        </div>
    );
};


export default Login;