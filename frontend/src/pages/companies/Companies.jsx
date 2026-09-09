import { useEffect, useState } from "react";

import {
    Building2,
    Globe,
    MapPin,
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
} from "lucide-react";

import {
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
} from "../../services/companyService";

import {
    getMyProfile,
} from "../../services/profileServices";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";


const EMPTY_FORM = {
    company_name: "",
    description: "",
    website: "",
    location: "",
};


const Companies = () => {

    const [companies, setCompanies] =
        useState([]);

    const [role, setRole] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editingCompany, setEditingCompany] =
        useState(null);

    const [saving, setSaving] =
        useState(false);

    const [deletingId, setDeletingId] =
        useState(null);

    const [form, setForm] =
        useState(EMPTY_FORM);


    /*
    |--------------------------------------------------------------------------
    | Load Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadCompanies();
        loadProfile();
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Load Profile
    |--------------------------------------------------------------------------
    */

    const loadProfile = async () => {

        try {

            const profile =
                await getMyProfile();

            setRole(
                profile.role
            );

        } catch (error) {

            console.error(
                "Unable to load user role:",
                error
            );

        }
    };


    /*
    |--------------------------------------------------------------------------
    | Load Companies
    |--------------------------------------------------------------------------
    */

    const loadCompanies = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getCompanies();

            const results =
                Array.isArray(data)
                    ? data
                    : data?.results || [];

            setCompanies(
                results
            );

        } catch (error) {

            console.error(
                "Failed to load companies:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to load companies. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Role Permission
    |--------------------------------------------------------------------------
    */

    const canManageCompanies =
        role === "recruiter" ||
        role === "admin";


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const filteredCompanies =
        companies.filter(
            (company) => {

                const keyword =
                    search
                        .trim()
                        .toLowerCase();

                if (!keyword) {
                    return true;
                }

                return (
                    company.company_name
                        ?.toLowerCase()
                        .includes(keyword) ||

                    company.location
                        ?.toLowerCase()
                        .includes(keyword) ||

                    company.description
                        ?.toLowerCase()
                        .includes(keyword)
                );
            }
        );


    /*
    |--------------------------------------------------------------------------
    | Open Create Form
    |--------------------------------------------------------------------------
    */

    const openCreate = () => {

        if (!canManageCompanies) {
            return;
        }

        setEditingCompany(null);

        setForm({
            ...EMPTY_FORM,
        });

        setShowForm(true);

        setError("");
        setSuccess("");
    };


    /*
    |--------------------------------------------------------------------------
    | Open Edit Form
    |--------------------------------------------------------------------------
    */

    const openEdit = (company) => {

        if (!canManageCompanies) {
            return;
        }

        setEditingCompany(
            company
        );

        setForm({
            company_name:
                company.company_name || "",

            description:
                company.description || "",

            website:
                company.website || "",

            location:
                company.location || "",
        });

        setShowForm(true);

        setError("");
        setSuccess("");
    };


    /*
    |--------------------------------------------------------------------------
    | Close Form
    |--------------------------------------------------------------------------
    */

    const closeForm = () => {

        if (saving) {
            return;
        }

        setShowForm(false);

        setEditingCompany(
            null
        );

        setForm({
            ...EMPTY_FORM,
        });

        setError("");
    };


    /*
    |--------------------------------------------------------------------------
    | Handle Input
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

        setError("");
        setSuccess("");
    };


    /*
    |--------------------------------------------------------------------------
    | Save Company
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        if (!canManageCompanies) {
            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                company_name:
                    form.company_name.trim(),

                description:
                    form.description.trim(),

                website:
                    form.website.trim(),

                location:
                    form.location.trim(),
            };


            if (editingCompany) {

                const updated =
                    await updateCompany(
                        editingCompany.id,
                        payload
                    );

                setCompanies(
                    (previous) =>
                        previous.map(
                            (company) =>
                                company.id ===
                                    editingCompany.id
                                    ? updated
                                    : company
                        )
                );

                setSuccess(
                    "Company updated successfully."
                );

            } else {

                const created =
                    await createCompany(
                        payload
                    );

                setCompanies(
                    (previous) => [
                        created,
                        ...previous,
                    ]
                );

                setSuccess(
                    "Company created successfully."
                );
            }

            setShowForm(false);

            setEditingCompany(
                null
            );

            setForm({
                ...EMPTY_FORM,
            });

        } catch (error) {

            console.error(
                "Failed to save company:",
                error
            );

            const responseData =
                error?.response?.data;

            if (
                responseData &&
                typeof responseData ===
                "object"
            ) {

                const firstError =
                    Object.values(
                        responseData
                    ).flat()[0];

                setError(
                    typeof firstError ===
                        "string"
                        ? firstError
                        : "Unable to save company. Please check the entered information."
                );

            } else {

                setError(
                    "Unable to save company. Please try again."
                );
            }

        } finally {

            setSaving(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Delete Company
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (
        company
    ) => {

        if (!canManageCompanies) {
            return;
        }

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${company.company_name}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(
                company.id
            );

            setError("");
            setSuccess("");

            await deleteCompany(
                company.id
            );

            setCompanies(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item.id !==
                            company.id
                    )
            );

            setSuccess(
                "Company deleted successfully."
            );

        } catch (error) {

            console.error(
                "Failed to delete company:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to delete company. Please try again."
            );

        } finally {

            setDeletingId(null);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <LoadingSpinner
                text="Loading companies..."
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (
        error &&
        companies.length === 0
    ) {

        return (
            <ErrorMessage
                message={error}
                onRetry={loadCompanies}
            />
        );
    }


    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div>

                    <h1 className="text-4xl font-bold text-gray-900">
                        Companies
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Explore companies and discover exciting career opportunities.
                    </p>

                </div>


                {canManageCompanies && (

                    <button
                        type="button"
                        onClick={
                            openCreate
                        }
                        className="px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition"
                    >

                        <Plus
                            size={20}
                        />

                        Add Company

                    </button>

                )}

            </div>


            {/* Success */}

            {success && (

                <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl font-medium">
                    {success}
                </div>

            )}


            {/* Error */}

            {error &&
                companies.length > 0 && (

                    <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl font-medium">
                        {error}
                    </div>

                )}


            {/* Search */}

            <div className="bg-white rounded-2xl shadow-md p-5">

                <div className="relative">

                    <Search
                        size={20}
                        className="absolute left-4 top-4 text-gray-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search companies..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

            </div>


            {/* Results */}

            {filteredCompanies.length === 0 ? (

                <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

                    <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">

                        <Building2
                            size={40}
                        />

                    </div>


                    <h2 className="text-2xl font-bold text-gray-900 mt-6">
                        No companies found
                    </h2>


                    <p className="text-gray-500 mt-2">

                        {search
                            ? "Try a different search term."
                            : "There are no companies available yet."}

                    </p>


                    {!search &&
                        canManageCompanies && (

                            <button
                                type="button"
                                onClick={
                                    openCreate
                                }
                                className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                            >

                                <span className="flex items-center gap-2">

                                    <Plus
                                        size={20}
                                    />

                                    Add Company

                                </span>

                            </button>

                        )}

                </div>

            ) : (

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {filteredCompanies.map(
                        (company) => (

                            <CompanyCard
                                key={
                                    company.id
                                }
                                company={
                                    company
                                }
                                deleting={
                                    deletingId ===
                                    company.id
                                }
                                onEdit={
                                    openEdit
                                }
                                onDelete={
                                    handleDelete
                                }
                                canManage={
                                    canManageCompanies
                                }
                            />

                        )
                    )}

                </div>

            )}


            {/* Company Form Modal */}

            {showForm &&
                canManageCompanies && (

                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5">

                        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">

                            {/* Modal Header */}

                            <div className="flex items-center justify-between p-7 border-b border-gray-100">

                                <div>

                                    <h2 className="text-2xl font-bold text-gray-900">

                                        {editingCompany
                                            ? "Edit Company"
                                            : "Add Company"}

                                    </h2>


                                    <p className="text-gray-500 mt-1">

                                        {editingCompany
                                            ? "Update company information."
                                            : "Create your company profile."}

                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center disabled:opacity-50"
                                >

                                    <X
                                        size={22}
                                    />

                                </button>

                            </div>


                            {/* Form */}

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="p-7 space-y-6"
                            >

                                <div>

                                    <label className="block font-semibold text-gray-700 mb-2">
                                        Company Name
                                    </label>

                                    <input
                                        type="text"
                                        name="company_name"
                                        value={
                                            form.company_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        placeholder="Enter company name"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>


                                <div>

                                    <label className="block font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="5"
                                        required
                                        placeholder="Describe your company..."
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>


                                <div className="grid md:grid-cols-2 gap-5">

                                    <div>

                                        <label className="block font-semibold text-gray-700 mb-2">
                                            Website
                                        </label>

                                        <input
                                            type="url"
                                            name="website"
                                            value={
                                                form.website
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="https://example.com"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                    </div>


                                    <div>

                                        <label className="block font-semibold text-gray-700 mb-2">
                                            Location
                                        </label>

                                        <input
                                            type="text"
                                            name="location"
                                            value={
                                                form.location
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            placeholder="Coimbatore, Tamil Nadu"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                    </div>

                                </div>


                                {/* Actions */}

                                <div className="flex justify-end gap-3 pt-3">

                                    <button
                                        type="button"
                                        onClick={
                                            closeForm
                                        }
                                        disabled={
                                            saving
                                        }
                                        className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        disabled={
                                            saving
                                        }
                                        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >

                                        {saving
                                            ? "Saving..."
                                            : editingCompany
                                                ? "Update Company"
                                                : "Create Company"}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Company Card
|--------------------------------------------------------------------------
*/

const CompanyCard = ({
    company,
    deleting,
    onEdit,
    onDelete,
    canManage,
}) => {

    return (
        <div className="bg-white rounded-3xl shadow-lg p-7 hover:shadow-xl transition">

            {/* Header */}

            <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">

                        <Building2
                            size={28}
                        />

                    </div>


                    <div>

                        <h2 className="text-xl font-bold text-gray-900">
                            {company.company_name}
                        </h2>


                        {company.location && (

                            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">

                                <MapPin
                                    size={15}
                                />

                                {company.location}

                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* Description */}

            {company.description && (

                <p className="text-gray-600 mt-5 leading-6 line-clamp-4">
                    {company.description}
                </p>

            )}


            {/* Website */}

            {company.website && (

                <a
                    href={
                        company.website
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >

                    <Globe
                        size={17}
                    />

                    Visit Website

                </a>

            )}


            {/* Actions */}

            {canManage && (

                <div className="flex gap-2 mt-6 pt-5 border-t border-gray-100">

                    <button
                        type="button"
                        onClick={() =>
                            onEdit(
                                company
                            )
                        }
                        className="flex-1 px-4 py-3 rounded-xl border border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
                    >

                        <Pencil
                            size={17}
                        />

                        Edit

                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            onDelete(
                                company
                            )
                        }
                        disabled={
                            deleting
                        }
                        className="flex-1 px-4 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                        <Trash2
                            size={17}
                        />

                        {deleting
                            ? "Deleting..."
                            : "Delete"}

                    </button>

                </div>

            )}

        </div>
    );
};


export default Companies;