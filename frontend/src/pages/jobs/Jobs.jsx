import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    Briefcase,
    Building2,
    MapPin,
    Search,
    SlidersHorizontal,
    Clock3,
    Sparkles,
    X,
} from "lucide-react";

import {
    getJobs,
} from "../../services/jobService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";


const Jobs = () => {

    const navigate = useNavigate();

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();


    const [
        jobs,
        setJobs,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | IMPORTANT
    |--------------------------------------------------------------------------
    |
    | Read the search value from the URL.
    |
    | Example:
    |
    | /jobs?search=python
    |
    | search = "python"
    |
    */

    const [
        search,
        setSearch,
    ] = useState(
        searchParams.get("search") || ""
    );


    const [
        location,
        setLocation,
    ] = useState(
        searchParams.get("location") || ""
    );


    const [
        jobType,
        setJobType,
    ] = useState(
        searchParams.get("job_type") || ""
    );


    const [
        error,
        setError,
    ] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Keep State In Sync With URL
    |--------------------------------------------------------------------------
    |
    | This is important because the global header search
    | navigates to:
    |
    | /jobs?search=something
    |
    */

    useEffect(() => {

        const urlSearch =
            searchParams.get(
                "search"
            ) || "";


        const urlLocation =
            searchParams.get(
                "location"
            ) || "";


        const urlJobType =
            searchParams.get(
                "job_type"
            ) || "";


        setSearch(
            urlSearch
        );


        setLocation(
            urlLocation
        );


        setJobType(
            urlJobType
        );

    }, [
        searchParams,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Load Jobs
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadJobs();
    }, []);


    const loadJobs = async () => {

        try {

            setLoading(true);
            setError("");


            const data =
                await getJobs();


            const results =
                Array.isArray(data)
                    ? data
                    : data?.results || [];


            setJobs(
                results
            );

        } catch (err) {

            console.error(
                err
            );


            setError(
                err?.response?.data?.detail ||
                "Unable to load jobs. Please try again."
            );

        } finally {

            setLoading(
                false
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Search + Filter
    |--------------------------------------------------------------------------
    */

    const filteredJobs =
        jobs.filter(
            (job) => {

                const keyword =
                    search
                        .toLowerCase()
                        .trim();


                const jobTitle =
                    String(
                        job?.title || ""
                    )
                        .toLowerCase()
                        .trim();


                const description =
                    String(
                        job?.description || ""
                    )
                        .toLowerCase()
                        .trim();


                const companyName =
                    String(
                        job?.company_name ||
                        job?.company?.company_name ||
                        job?.company?.name ||
                        ""
                    )
                        .toLowerCase()
                        .trim();


                const jobLocation =
                    String(
                        job?.location || ""
                    )
                        .toLowerCase()
                        .trim();


                /*
                |--------------------------------------------------------------------------
                | Search
                |--------------------------------------------------------------------------
                |
                | Search by:
                |
                | - Job title
                | - Description
                | - Company name
                |
                */

                const matchesSearch =
                    !keyword ||
                    jobTitle.includes(
                        keyword
                    ) ||
                    description.includes(
                        keyword
                    ) ||
                    companyName.includes(
                        keyword
                    );


                /*
                |--------------------------------------------------------------------------
                | Location
                |--------------------------------------------------------------------------
                */

                const locationKeyword =
                    location
                        .toLowerCase()
                        .trim();


                const matchesLocation =
                    !locationKeyword ||
                    jobLocation.includes(
                        locationKeyword
                    );


                /*
                |--------------------------------------------------------------------------
                | Job Type
                |--------------------------------------------------------------------------
                */

                const matchesType =
                    !jobType ||
                    job.job_type ===
                    jobType;


                return (
                    matchesSearch &&
                    matchesLocation &&
                    matchesType
                );
            }
        );


    /*
    |--------------------------------------------------------------------------
    | Search Input Change
    |--------------------------------------------------------------------------
    |
    | Keep the search state AND URL synchronized.
    |
    */

    const handleSearchChange = (
        event
    ) => {

        const value =
            event.target.value;


        setSearch(
            value
        );


        const params =
            new URLSearchParams(
                searchParams
            );


        if (
            value.trim()
        ) {

            params.set(
                "search",
                value
            );

        } else {

            params.delete(
                "search"
            );
        }


        setSearchParams(
            params,
            {
                replace: true,
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Location Change
    |--------------------------------------------------------------------------
    */

    const handleLocationChange = (
        event
    ) => {

        const value =
            event.target.value;


        setLocation(
            value
        );


        const params =
            new URLSearchParams(
                searchParams
            );


        if (
            value.trim()
        ) {

            params.set(
                "location",
                value
            );

        } else {

            params.delete(
                "location"
            );
        }


        setSearchParams(
            params,
            {
                replace: true,
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Job Type Change
    |--------------------------------------------------------------------------
    */

    const handleJobTypeChange = (
        event
    ) => {

        const value =
            event.target.value;


        setJobType(
            value
        );


        const params =
            new URLSearchParams(
                searchParams
            );


        if (value) {

            params.set(
                "job_type",
                value
            );

        } else {

            params.delete(
                "job_type"
            );
        }


        setSearchParams(
            params,
            {
                replace: true,
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Clear Filters
    |--------------------------------------------------------------------------
    */

    const clearFilters = () => {

        setSearch(
            ""
        );

        setLocation(
            ""
        );

        setJobType(
            ""
        );


        setSearchParams(
            {},
            {
                replace: true,
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <LoadingSpinner
                text="Loading available jobs..."
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
                message={
                    error
                }
                onRetry={
                    loadJobs
                }
            />
        );
    }


    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

                            <Briefcase
                                size={25}
                            />

                        </div>


                        <h1 className="text-4xl font-bold text-gray-900">
                            Find Your Next Job
                        </h1>

                    </div>


                    <p className="text-gray-500 mt-3">
                        Discover opportunities that match your skills and career goals.
                    </p>

                </div>


                <div className="bg-white rounded-2xl shadow-sm border px-5 py-4">

                    <p className="text-sm text-gray-500">
                        Available Jobs
                    </p>


                    <p className="text-2xl font-bold text-blue-600">
                        {
                            filteredJobs.length
                        }
                    </p>

                </div>

            </div>


            {/* Search */}

            <div className="bg-linear-to-r from-blue-700 to-indigo-700 rounded-3xl p-6 shadow-xl">

                <div className="grid lg:grid-cols-12 gap-4">

                    {/* Search */}

                    <div className="lg:col-span-6 relative">

                        <Search
                            size={20}
                            className="absolute left-4 top-4 text-gray-400"
                        />


                        <input
                            type="text"
                            value={
                                search
                            }
                            onChange={
                                handleSearchChange
                            }
                            placeholder="Search job title, skills or company..."
                            className="w-full bg-white rounded-xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-blue-300"
                        />

                    </div>


                    {/* Location */}

                    <div className="lg:col-span-3 relative">

                        <MapPin
                            size={20}
                            className="absolute left-4 top-4 text-gray-400"
                        />


                        <input
                            type="text"
                            value={
                                location
                            }
                            onChange={
                                handleLocationChange
                            }
                            placeholder="Location"
                            className="w-full bg-white rounded-xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-blue-300"
                        />

                    </div>


                    {/* Job Type */}

                    <div className="lg:col-span-3">

                        <select
                            value={
                                jobType
                            }
                            onChange={
                                handleJobTypeChange
                            }
                            className="w-full bg-white rounded-xl px-4 py-4 outline-none focus:ring-4 focus:ring-blue-300"
                        >

                            <option value="">
                                All Job Types
                            </option>


                            <option value="Full Time">
                                Full Time
                            </option>


                            <option value="Part Time">
                                Part Time
                            </option>


                            <option value="Internship">
                                Internship
                            </option>


                            <option value="Remote">
                                Remote
                            </option>

                        </select>

                    </div>

                </div>

            </div>


            {/* Active Filters */}

            {(search ||
                location ||
                jobType) && (

                    <div className="flex flex-wrap items-center gap-3">

                        <SlidersHorizontal
                            size={19}
                            className="text-gray-500"
                        />


                        <span className="text-sm text-gray-500">
                            Filters active
                        </span>


                        {search && (

                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                Search: {search}
                            </span>
                        )}


                        {location && (

                            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                                Location: {location}
                            </span>
                        )}


                        {jobType && (

                            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                                Type: {jobType}
                            </span>
                        )}


                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700"
                        >

                            <X
                                size={16}
                            />

                            Clear

                        </button>

                    </div>
                )}


            {/* Search Result Information */}

            {search && (

                <div className="text-sm text-gray-500">

                    Showing{" "}

                    <span className="font-semibold text-gray-900">
                        {
                            filteredJobs.length
                        }
                    </span>

                    {" "}
                    matching job
                    {
                        filteredJobs.length ===
                            1
                            ? ""
                            : "s"
                    }

                    {" "}
                    for{" "}

                    <span className="font-semibold text-gray-900">
                        "{search}"
                    </span>

                </div>
            )}


            {/* No Results */}

            {filteredJobs.length ===
                0 ? (

                <div className="bg-white rounded-3xl shadow-lg">

                    <EmptyState
                        title="No Jobs Found"
                        message={
                            jobs.length ===
                                0
                                ? "There are currently no active jobs available."
                                : "No jobs match your search or filters. Try a different keyword."
                        }
                    />


                    {jobs.length >
                        0 && (

                            <div className="flex justify-center pb-8">

                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                                >
                                    Clear Filters
                                </button>

                            </div>
                        )}

                </div>

            ) : (

                <div className="grid xl:grid-cols-2 gap-6">

                    {filteredJobs.map(
                        (job) => (

                            <JobCard
                                key={
                                    job.id
                                }
                                job={
                                    job
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
}) => {

    const navigate =
        useNavigate();


    const companyName =
        job.company_name ||
        job.company?.company_name ||
        job.company?.name ||
        "Company";


    return (
        <article className="group bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-7">

            <div className="flex justify-between gap-5">

                <div className="flex gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center shrink-0">

                        <Building2
                            size={27}
                        />

                    </div>


                    <div>

                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">

                            {
                                job.title
                            }

                        </h2>


                        <p className="text-gray-500 mt-1">

                            {
                                companyName
                            }

                        </p>

                    </div>

                </div>


                {job.match_score !==
                    undefined && (

                        <div className="shrink-0 text-center">

                            <div className="flex items-center gap-1 text-green-600 font-bold">

                                <Sparkles
                                    size={16}
                                />

                                {
                                    job.match_score
                                }%

                            </div>


                            <p className="text-xs text-gray-400">
                                Match
                            </p>

                        </div>
                    )}

            </div>


            <div className="flex flex-wrap gap-3 mt-6 text-sm text-gray-500">

                {job.location && (

                    <span className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">

                        <MapPin
                            size={16}
                        />

                        {
                            job.location
                        }

                    </span>
                )}


                {job.job_type && (

                    <span className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">

                        <Briefcase
                            size={16}
                        />

                        {
                            job.job_type
                        }

                    </span>
                )}


                {job.experience && (

                    <span className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">

                        <Clock3
                            size={16}
                        />

                        {
                            job.experience
                        }

                    </span>
                )}

            </div>


            {job.description && (

                <p className="mt-6 text-gray-600 leading-7 line-clamp-3">

                    {
                        job.description
                    }

                </p>
            )}


            {/* Actions */}

            <div className="mt-7 flex gap-3">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/jobs/${job.id}`
                        )
                    }
                    className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-95 transition"
                >

                    View Details

                </button>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/jobs/${job.id}`
                        )
                    }
                    className="px-5 py-3 rounded-xl border border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition"
                >

                    Apply

                </button>

            </div>

        </article>
    );
};


export default Jobs;