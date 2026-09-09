import { useEffect, useState } from "react";

import api from "../../api/axios";


const AdminCompanies = () => {

    const [companies, setCompanies] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [editingCompany, setEditingCompany] =
        useState(null);

    const [formData, setFormData] = useState({
        company_name: "",
        description: "",
        location: "",
        website: "",
    });

    const [saving, setSaving] =
        useState(false);

    const [saveError, setSaveError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Companies
    |--------------------------------------------------------------------------
    */

    const loadCompanies = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "companies/"
                );

            setCompanies(
                response.data
            );

        } catch (error) {

            console.error(
                "Unable to load companies:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to load companies."
            );

        } finally {

            setLoading(false);

        }
    };


    /*
    |--------------------------------------------------------------------------
    | Open Edit Modal
    |--------------------------------------------------------------------------
    */

    const handleEdit = (company) => {

        setEditingCompany(company);

        setFormData({
            company_name:
                company.company_name || "",

            description:
                company.description || "",

            location:
                company.location || "",

            website:
                company.website || "",
        });

        setSaveError("");
    };


    /*
    |--------------------------------------------------------------------------
    | Close Edit Modal
    |--------------------------------------------------------------------------
    */

    const handleCloseEdit = () => {

        if (saving) {
            return;
        }

        setEditingCompany(null);

        setFormData({
            company_name: "",
            description: "",
            location: "",
            website: "",
        });

        setSaveError("");
    };


    /*
    |--------------------------------------------------------------------------
    | Form Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Update Company
    |--------------------------------------------------------------------------
    */

    const handleUpdate = async (event) => {

        event.preventDefault();

        if (!editingCompany) {
            return;
        }

        try {

            setSaving(true);
            setSaveError("");

            const response =
                await api.patch(
                    `companies/${editingCompany.id}/`,
                    formData
                );

            setCompanies(
                (previous) =>
                    previous.map(
                        (company) =>
                            company.id ===
                                editingCompany.id
                                ? response.data
                                : company
                    )
            );

            handleCloseEdit();

        } catch (error) {

            console.error(
                "Unable to update company:",
                error
            );

            setSaveError(
                error?.response?.data?.detail ||
                "Unable to update company."
            );

        } finally {

            setSaving(false);

        }
    };


    /*
    |--------------------------------------------------------------------------
    | Delete Company
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this company?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `companies/${id}/`
            );

            setCompanies(
                (previous) =>
                    previous.filter(
                        (company) =>
                            company.id !== id
                    )
            );

        } catch (error) {

            console.error(
                "Unable to delete company:",
                error
            );

            alert(
                error?.response?.data?.detail ||
                "Unable to delete company."
            );

        }
    };


    /*
    |--------------------------------------------------------------------------
    | Load on Mount
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadCompanies();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

                    <p className="text-gray-500 mt-4">
                        Loading companies...
                    </p>

                </div>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (
            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="text-center bg-white rounded-3xl shadow-lg p-10 max-w-lg">

                    <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold">
                        !
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mt-6">
                        Unable to load companies
                    </h1>

                    <p className="text-gray-500 mt-3">
                        {error}
                    </p>

                    <button
                        onClick={loadCompanies}
                        className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-8">

            {/* Header */}

            <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-lg p-8 text-white">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    <div>

                        <p className="text-indigo-100 uppercase tracking-wider text-sm font-semibold">
                            Administration
                        </p>

                        <h1 className="text-4xl font-bold mt-2">
                            Companies
                        </h1>

                        <p className="text-indigo-100 mt-3 text-lg">
                            Manage all companies registered on the platform.
                        </p>

                    </div>

                    <button
                        onClick={loadCompanies}
                        className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 font-semibold transition"
                    >
                        ↻ Refresh
                    </button>

                </div>

            </div>


            {/* Companies */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="px-8 py-6 border-b border-gray-100">

                    <h2 className="text-2xl font-bold text-gray-900">
                        All Companies
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {companies.length}{" "}
                        {companies.length === 1
                            ? "company"
                            : "companies"}{" "}
                        registered
                    </p>

                </div>


                {/* Empty State */}

                {companies.length === 0 ? (

                    <div className="px-8 py-16 text-center">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
                            🏢
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mt-5">
                            No companies found
                        </h3>

                        <p className="text-gray-500 mt-2">
                            There are no companies registered yet.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="bg-gray-50 border-b border-gray-100">

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        ID
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Company
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Location
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Website
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Created By
                                    </th>

                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {companies.map(
                                    (company) => (

                                        <tr
                                            key={company.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                                        >

                                            {/* ID */}

                                            <td className="px-6 py-5 text-gray-600">
                                                {company.id}
                                            </td>


                                            {/* Company */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-3">

                                                    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                                        {company.company_name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            "C"}
                                                    </div>

                                                    <div>

                                                        <p className="font-semibold text-gray-900">
                                                            {company.company_name}
                                                        </p>

                                                        <p className="text-sm text-gray-500 max-w-xs truncate">
                                                            {company.description ||
                                                                "No description"}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* Location */}

                                            <td className="px-6 py-5 text-gray-600">
                                                {company.location ||
                                                    "—"}
                                            </td>


                                            {/* Website */}

                                            <td className="px-6 py-5">

                                                {company.website ? (

                                                    <a
                                                        href={company.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                                                    >
                                                        Visit
                                                    </a>

                                                ) : (

                                                    <span className="text-gray-400">
                                                        —
                                                    </span>

                                                )}

                                            </td>


                                            {/* Created By */}

                                            <td className="px-6 py-5 text-gray-600">
                                                {company.created_by ||
                                                    "—"}
                                            </td>


                                            {/* Actions */}

                                            <td className="px-6 py-5">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                company
                                                            )
                                                        }
                                                        className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium transition"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                company.id
                                                            )
                                                        }
                                                        className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* Edit Modal */}

            {editingCompany && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">

                        {/* Modal Header */}

                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">

                            <div>

                                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                                    Company Management
                                </p>

                                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                    Edit Company
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={handleCloseEdit}
                                disabled={saving}
                                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl transition disabled:opacity-50"
                            >
                                ×
                            </button>

                        </div>


                        {/* Form */}

                        <form
                            onSubmit={handleUpdate}
                            className="p-8 space-y-5"
                        >

                            {/* Error */}

                            {saveError && (

                                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                                    {saveError}
                                </div>

                            )}


                            {/* Company Name */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    name="company_name"
                                    value={
                                        formData.company_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />

                            </div>


                            {/* Description */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />

                            </div>


                            {/* Location */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={
                                        formData.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />

                            </div>


                            {/* Website */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Website
                                </label>

                                <input
                                    type="url"
                                    name="website"
                                    value={
                                        formData.website
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="https://example.com"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />

                            </div>


                            {/* Buttons */}

                            <div className="flex justify-end gap-3 pt-4">

                                <button
                                    type="button"
                                    onClick={
                                        handleCloseEdit
                                    }
                                    disabled={saving}
                                    className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};


export default AdminCompanies;