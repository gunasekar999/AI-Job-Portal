import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Briefcase,
    CalendarDays,
    CheckCircle2,
    Edit3,
    Eye,
    Loader2,
    MapPin,
    Plus,
    Trash2,
    X,
} from "lucide-react";

import {
    getRecruiterJobs,
    createJob,
    updateJob,
    deleteJob,
} from "../../services/jobService";

import {
    getMyCompanies,
} from "../../services/companyService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";


const JOB_TYPES = [
    "Full Time",
    "Part Time",
    "Internship",
    "Remote",
];


const EXPERIENCE_LEVELS = [
    "Fresher",
    "1-2 Years",
    "3-5 Years",
    "5+ Years",
];


const emptyForm = {
    company: "",
    title: "",
    description: "",
    location: "",
    salary: "",
    job_type: "Full Time",
    experience: "Fresher",
    deadline: "",
    is_active: true,
};


const RecruiterJobs = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);

    const [companies, setCompanies] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [companiesLoading, setCompaniesLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [deletingId, setDeletingId] =
        useState(null);

    const [showForm, setShowForm] =
        useState(false);

    const [editingJob, setEditingJob] =
        useState(null);

    const [form, setForm] =
        useState(emptyForm);

    const [error, setError] =
        useState("");

    const [formError, setFormError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadJobs();
        loadCompanies();
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Load Recruiter Jobs
    |--------------------------------------------------------------------------
    */

    const loadJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getRecruiterJobs();

            const results =
                Array.isArray(data)
                    ? data
                    : data?.results || [];

            setJobs(results);

        } catch (error) {
            console.error(
                "Unable to load recruiter jobs:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to load recruiter jobs. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Load Recruiter's Companies
    |--------------------------------------------------------------------------
    */

    const loadCompanies = async () => {
        try {
            setCompaniesLoading(true);

            const data =
                await getMyCompanies();

            const results =
                Array.isArray(data)
                    ? data
                    : data?.results || [];

            setCompanies(results);

        } catch (error) {
            console.error(
                "Unable to load companies:",
                error
            );

            setFormError(
                error?.response?.data?.detail ||
                "Unable to load your companies."
            );

        } finally {
            setCompaniesLoading(false);
        }
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
            type,
            checked,
        } = event.target;

        setForm((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

        setFormError("");
        setSuccess("");
    };


    /*
    |--------------------------------------------------------------------------
    | Open Create Form
    |--------------------------------------------------------------------------
    */

    const openCreateForm = () => {
        setEditingJob(null);

        setForm({
            ...emptyForm,

            company:
                companies.length === 1
                    ? String(
                        companies[0].id
                    )
                    : "",
        });

        setFormError("");
        setSuccess("");
        setShowForm(true);
    };


    /*
    |--------------------------------------------------------------------------
    | Open Edit Form
    |--------------------------------------------------------------------------
    */

    const openEditForm = (job) => {
        setEditingJob(job);

        const companyId =
            job.company?.id ||
            job.company ||
            "";

        setForm({
            company:
                companyId
                    ? String(companyId)
                    : "",

            title:
                job.title || "",

            description:
                job.description || "",

            location:
                job.location || "",

            salary:
                job.salary || "",

            job_type:
                job.job_type ||
                "Full Time",

            experience:
                job.experience ||
                "Fresher",

            deadline:
                job.deadline || "",

            is_active:
                job.is_active ?? true,
        });

        setFormError("");
        setSuccess("");
        setShowForm(true);
    };


    /*
    |--------------------------------------------------------------------------
    | View Job Details
    |--------------------------------------------------------------------------
    */

    const viewJobDetails = (job) => {
        navigate(
            `/jobs/${job.id}`
        );
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
        setEditingJob(null);
        setForm(emptyForm);
        setFormError("");
    };


    /*
    |--------------------------------------------------------------------------
    | Create / Update Job
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormError("");
        setSuccess("");

        if (!form.company) {
            setFormError(
                "Please select a company."
            );

            return;
        }

        if (
            !form.title.trim() ||
            !form.description.trim() ||
            !form.location.trim() ||
            !form.salary ||
            !form.deadline
        ) {
            setFormError(
                "Please fill in all required fields."
            );

            return;
        }

        try {
            setSaving(true);

            const payload = {
                company:
                    Number(
                        form.company
                    ),

                title:
                    form.title.trim(),

                description:
                    form.description.trim(),

                location:
                    form.location.trim(),

                salary:
                    form.salary,

                job_type:
                    form.job_type,

                experience:
                    form.experience,

                deadline:
                    form.deadline,

                is_active:
                    form.is_active,
            };

            if (editingJob) {
                const updated =
                    await updateJob(
                        editingJob.id,
                        payload
                    );

                setJobs(
                    (previous) =>
                        previous.map(
                            (job) =>
                                job.id ===
                                    editingJob.id
                                    ? {
                                        ...job,
                                        ...updated,
                                    }
                                    : job
                        )
                );

                setSuccess(
                    "Job updated successfully."
                );

            } else {
                const created =
                    await createJob(
                        payload
                    );

                setJobs(
                    (previous) => [
                        created,
                        ...previous,
                    ]
                );

                setSuccess(
                    "Job created successfully."
                );
            }

            setShowForm(false);
            setEditingJob(null);
            setForm(emptyForm);

        } catch (error) {
            console.error(
                "Unable to save job:",
                error
            );

            const backendErrors =
                error?.response?.data;

            if (
                backendErrors &&
                typeof backendErrors ===
                "object"
            ) {
                const firstError =
                    Object.values(
                        backendErrors
                    ).flat()[0];

                setFormError(
                    firstError ||
                    "Unable to save job."
                );

            } else {
                setFormError(
                    "Unable to save job."
                );
            }

        } finally {
            setSaving(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Delete Job
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (job) => {
        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${job.title}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(job.id);
            setError("");
            setSuccess("");

            await deleteJob(job.id);

            setJobs(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item.id !== job.id
                    )
            );

            setSuccess(
                "Job deleted successfully."
            );

        } catch (error) {
            console.error(
                "Unable to delete job:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to delete job."
            );

        } finally {
            setDeletingId(null);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Toggle Job Status
    |--------------------------------------------------------------------------
    */

    const toggleJobStatus = async (job) => {
        try {
            setError("");
            setSuccess("");

            const updated =
                await updateJob(
                    job.id,
                    {
                        is_active:
                            !job.is_active,
                    }
                );

            setJobs(
                (previous) =>
                    previous.map(
                        (item) =>
                            item.id === job.id
                                ? {
                                    ...item,
                                    ...updated,
                                }
                                : item
                    )
            );

            setSuccess(
                updated.is_active
                    ? "Job published successfully."
                    : "Job closed successfully."
            );

        } catch (error) {
            console.error(
                "Unable to update job status:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to update job status."
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const activeJobs =
        jobs.filter(
            (job) => job.is_active
        ).length;

    const inactiveJobs =
        jobs.filter(
            (job) => !job.is_active
        ).length;


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <LoadingSpinner
                text="Loading your jobs..."
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Main Error
    |--------------------------------------------------------------------------
    */

    if (
        error &&
        jobs.length === 0
    ) {
        return (
            <ErrorMessage
                message={error}
                onRetry={loadJobs}
            />
        );
    }


    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                    <h1 className="text-4xl font-bold text-gray-900">
                        Recruiter Jobs
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Create and manage your job postings.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={openCreateForm}
                    disabled={
                        companiesLoading ||
                        companies.length === 0
                    }
                    className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >

                    <Plus size={20} />

                    Create Job

                </button>

            </div>


            {/* Error */}

            {error &&
                jobs.length > 0 && (

                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 flex items-center justify-between gap-4">

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={
                                loadJobs
                            }
                            className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                        >
                            Retry
                        </button>

                    </div>
                )}


            {/* Success */}

            {success && (

                <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-5 flex items-center gap-3">

                    <CheckCircle2
                        size={20}
                    />

                    <p>
                        {success}
                    </p>

                </div>
            )}


            {/* No Companies */}

            {!companiesLoading &&
                companies.length === 0 && (

                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">

                        <h3 className="font-bold text-yellow-800">
                            No company found
                        </h3>

                        <p className="text-yellow-700 mt-1">
                            Create a company first before posting a job.
                        </p>

                    </div>
                )}


            {/* Statistics */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <StatCard
                    title="Total Jobs"
                    value={
                        jobs.length
                    }
                    icon={
                        <Briefcase
                            size={24}
                        />
                    }
                    iconClass="bg-blue-100 text-blue-600"
                />


                <StatCard
                    title="Active Jobs"
                    value={
                        activeJobs
                    }
                    icon={
                        <CheckCircle2
                            size={24}
                        />
                    }
                    iconClass="bg-green-100 text-green-600"
                />


                <StatCard
                    title="Closed Jobs"
                    value={
                        inactiveJobs
                    }
                    icon={
                        <X
                            size={24}
                        />
                    }
                    iconClass="bg-red-100 text-red-600"
                />

            </div>


            {/* Job Form */}

            {showForm && (

                <div className="bg-white rounded-3xl shadow-xl p-8">

                    <div className="flex items-center justify-between mb-8">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingJob
                                    ? "Edit Job"
                                    : "Create New Job"}
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Fill in the job details below.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={closeForm}
                            disabled={saving}
                            className="p-2 rounded-xl hover:bg-slate-100 transition"
                        >

                            <X size={22} />

                        </button>

                    </div>


                    {/* Form Error */}

                    {formError && (

                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
                            {formError}
                        </div>
                    )}


                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="space-y-6"
                    >

                        {/* Company */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Company
                            </label>

                            <select
                                name="company"
                                value={
                                    form.company
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    companiesLoading ||
                                    companies.length === 0
                                }
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >

                                <option value="">
                                    Select Company
                                </option>

                                {companies.map(
                                    (company) => (

                                        <option
                                            key={
                                                company.id
                                            }
                                            value={
                                                company.id
                                            }
                                        >
                                            {
                                                company.company_name
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* Job Title */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Job Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={
                                    form.title
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Full Stack Python Developer"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Description */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Job Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleChange
                                }
                                rows={6}
                                placeholder="Describe the role, responsibilities and requirements..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Location + Salary */}

                        <div className="grid md:grid-cols-2 gap-5">

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Location
                                </label>

                                <div className="relative">

                                    <MapPin
                                        size={18}
                                        className="absolute left-4 top-3.5 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        name="location"
                                        value={
                                            form.location
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Chennai"
                                        className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>

                            </div>


                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Salary
                                </label>

                                <input
                                    type="number"
                                    name="salary"
                                    value={
                                        form.salary
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="e.g. 600000"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                        </div>


                        {/* Job Type + Experience */}

                        <div className="grid md:grid-cols-2 gap-5">

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Job Type
                                </label>

                                <select
                                    name="job_type"
                                    value={
                                        form.job_type
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    {JOB_TYPES.map(
                                        (type) => (

                                            <option
                                                key={
                                                    type
                                                }
                                                value={
                                                    type
                                                }
                                            >
                                                {type}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Experience
                                </label>

                                <select
                                    name="experience"
                                    value={
                                        form.experience
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    {EXPERIENCE_LEVELS.map(
                                        (level) => (

                                            <option
                                                key={
                                                    level
                                                }
                                                value={
                                                    level
                                                }
                                            >
                                                {level}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>


                        {/* Deadline */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Application Deadline
                            </label>

                            <div className="relative">

                                <CalendarDays
                                    size={18}
                                    className="absolute left-4 top-3.5 text-gray-400"
                                />

                                <input
                                    type="date"
                                    name="deadline"
                                    value={
                                        form.deadline
                                    }
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split(
                                                "T"
                                            )[0]
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                        </div>


                        {/* Active */}

                        <label className="flex items-center gap-3 cursor-pointer">

                            <input
                                type="checkbox"
                                name="is_active"
                                checked={
                                    form.is_active
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-5 h-5"
                            />

                            <span className="text-gray-700 font-medium">
                                Publish job immediately
                            </span>

                        </label>


                        {/* Buttons */}

                        <div className="flex justify-end gap-3 pt-3">

                            <button
                                type="button"
                                onClick={
                                    closeForm
                                }
                                disabled={saving}
                                className="px-6 py-3 rounded-xl border border-gray-200 font-semibold hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={
                                    saving ||
                                    companiesLoading ||
                                    companies.length === 0
                                }
                                className="px-7 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center gap-2 disabled:opacity-60"
                            >

                                {saving && (

                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                )}

                                {editingJob
                                    ? "Update Job"
                                    : "Create Job"}

                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* Jobs */}

            {jobs.length === 0 ? (

                <div className="bg-white rounded-3xl shadow-lg">

                    <EmptyState
                        title="No Jobs Posted"
                        message="Create your first job posting to start receiving applications."
                    />

                    <div className="flex justify-center pb-8">

                        <button
                            type="button"
                            onClick={
                                openCreateForm
                            }
                            disabled={
                                companiesLoading ||
                                companies.length === 0
                            }
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        >

                            <Plus size={20} />

                            Create Job

                        </button>

                    </div>

                </div>

            ) : (

                <div className="grid xl:grid-cols-2 gap-6">

                    {jobs.map(
                        (job) => (

                            <JobCard
                                key={
                                    job.id
                                }
                                job={
                                    job
                                }
                                deleting={
                                    deletingId ===
                                    job.id
                                }
                                onView={
                                    viewJobDetails
                                }
                                onEdit={
                                    openEditForm
                                }
                                onDelete={
                                    handleDelete
                                }
                                onToggle={
                                    toggleJobStatus
                                }
                            />

                        )
                    )}

                </div>

            )}

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Job Card
|--------------------------------------------------------------------------
*/

const JobCard = ({
    job,
    deleting,
    onView,
    onEdit,
    onDelete,
    onToggle,
}) => (

    <article className="bg-white rounded-3xl shadow-lg p-7 hover:shadow-xl transition">

        <div className="flex items-start justify-between gap-5">

            <div>

                <h2 className="text-2xl font-bold text-gray-900">
                    {job.title}
                </h2>

                <p className="text-gray-500 mt-2">
                    {job.company_name ||
                        job.company?.company_name ||
                        "Your Company"}
                </p>

            </div>


            <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${job.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
            >
                {job.is_active
                    ? "Active"
                    : "Closed"}
            </span>

        </div>


        <div className="grid sm:grid-cols-2 gap-3 mt-6 text-sm text-gray-600">

            <div className="flex items-center gap-2">

                <MapPin size={17} />

                {job.location}

            </div>


            <div className="flex items-center gap-2">

                <Briefcase size={17} />

                {job.job_type}

            </div>


            <div className="flex items-center gap-2">

                <CalendarDays
                    size={17}
                />

                {job.experience}

            </div>


            <div className="flex items-center gap-2">

                <CalendarDays
                    size={17}
                />

                Deadline:{" "}

                {formatDate(
                    job.deadline
                )}

            </div>

        </div>


        <div className="mt-6 bg-slate-50 rounded-2xl p-4">

            <p className="text-sm text-gray-500">
                Salary
            </p>

            <p className="text-xl font-bold text-gray-900 mt-1">

                {formatSalary(
                    job.salary
                )}

            </p>

        </div>


        <p className="text-gray-600 mt-6 line-clamp-3 leading-6">
            {job.description}
        </p>


        {/* Actions */}

        <div className="flex flex-wrap gap-3 mt-7">

            {/* View Details */}

            <button
                type="button"
                onClick={() =>
                    onView(job)
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-semibold hover:bg-indigo-100 transition"
            >

                <Eye size={17} />

                View Details

            </button>


            {/* Edit */}

            <button
                type="button"
                onClick={() =>
                    onEdit(job)
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition"
            >

                <Edit3 size={17} />

                Edit

            </button>


            {/* Close / Publish */}

            <button
                type="button"
                onClick={() =>
                    onToggle(job)
                }
                className={`px-4 py-2.5 rounded-xl font-semibold transition ${job.is_active
                    ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
            >

                {job.is_active
                    ? "Close Job"
                    : "Publish Job"}

            </button>


            {/* Delete */}

            <button
                type="button"
                disabled={
                    deleting
                }
                onClick={() =>
                    onDelete(job)
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition disabled:opacity-60"
            >

                {deleting ? (

                    <Loader2
                        size={17}
                        className="animate-spin"
                    />

                ) : (

                    <Trash2
                        size={17}
                    />

                )}

                Delete

            </button>

        </div>

    </article>
);


/*
|--------------------------------------------------------------------------
| Statistics Card
|--------------------------------------------------------------------------
*/

const StatCard = ({
    title,
    value,
    icon,
    iconClass,
}) => (

    <div className="bg-white rounded-3xl shadow-lg p-6">

        <div className="flex items-center justify-between">

            <div>

                <p className="text-gray-500">
                    {title}
                </p>

                <p className="text-4xl font-bold mt-2">
                    {value}
                </p>

            </div>


            <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconClass}`}
            >
                {icon}
            </div>

        </div>

    </div>
);


/*
|--------------------------------------------------------------------------
| Date Formatter
|--------------------------------------------------------------------------
*/

const formatDate = (
    date
) => {

    if (!date) {
        return "—";
    }

    return new Date(
        date
    ).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};


/*
|--------------------------------------------------------------------------
| Salary Formatter
|--------------------------------------------------------------------------
*/

const formatSalary = (
    salary
) => {

    if (
        salary === null ||
        salary === undefined ||
        salary === ""
    ) {
        return "Not specified";
    }

    const numericSalary =
        Number(salary);

    if (
        Number.isNaN(
            numericSalary
        )
    ) {
        return salary;
    }

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }
    ).format(
        numericSalary
    );
};


export default RecruiterJobs;