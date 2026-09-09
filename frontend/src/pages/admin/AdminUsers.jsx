import { useEffect, useMemo, useState } from "react";

import {
    getAdminUsers,
    updateAdminUser,
} from "../../services/adminService";


const AdminUsers = () => {

    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");

    const [roleFilter, setRoleFilter] =
        useState("all");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [updatingId, setUpdatingId] =
        useState(null);

    const [updateError, setUpdateError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Users
    |--------------------------------------------------------------------------
    */

    const loadUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getAdminUsers();

            setUsers(data);

        } catch (error) {

            console.error(
                "Unable to load admin users:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to load users."
            );

        } finally {

            setLoading(false);

        }
    };


    /*
    |--------------------------------------------------------------------------
    | Load On Mount
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadUsers();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Update User Status
    |--------------------------------------------------------------------------
    */

    const handleStatusChange = async (
        user,
        newStatus
    ) => {

        const isActive =
            newStatus === "active";


        if (
            user.is_active === isActive
        ) {
            return;
        }


        try {

            setUpdatingId(user.id);
            setUpdateError("");


            const updatedUser =
                await updateAdminUser(
                    user.id,
                    {
                        is_active: isActive,
                    }
                );


            setUsers(
                (previousUsers) =>
                    previousUsers.map(
                        (currentUser) =>
                            currentUser.id ===
                                user.id
                                ? updatedUser
                                : currentUser
                    )
            );

        } catch (error) {

            console.error(
                "Unable to update user status:",
                error
            );

            setUpdateError(
                error?.response?.data?.detail ||
                "Unable to update user status."
            );

        } finally {

            setUpdatingId(null);

        }
    };


    /*
    |--------------------------------------------------------------------------
    | Search + Role + Status Filter
    |--------------------------------------------------------------------------
    */

    const filteredUsers = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();


        return users.filter((user) => {

            const matchesSearch =
                !searchValue ||
                user.username
                    ?.toLowerCase()
                    .includes(searchValue) ||
                user.email
                    ?.toLowerCase()
                    .includes(searchValue);


            const matchesRole =
                roleFilter === "all" ||
                user.role === roleFilter;


            const matchesStatus =
                statusFilter === "all" ||
                (
                    statusFilter === "active" &&
                    user.is_active === true
                ) ||
                (
                    statusFilter === "inactive" &&
                    user.is_active === false
                );


            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );

        });

    }, [
        users,
        search,
        roleFilter,
        statusFilter,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Clear Filters
    |--------------------------------------------------------------------------
    */

    const clearFilters = () => {

        setSearch("");
        setRoleFilter("all");
        setStatusFilter("all");

    };


    /*
    |--------------------------------------------------------------------------
    | Role Style
    |--------------------------------------------------------------------------
    */

    const getRoleStyle = (role) => {

        switch (role) {

            case "candidate":
                return "bg-blue-100 text-blue-700";

            case "recruiter":
                return "bg-purple-100 text-purple-700";

            case "admin":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };


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
                        Loading users...
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

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-lg">

                    <h1 className="text-2xl font-bold text-gray-900">
                        Unable to load users
                    </h1>

                    <p className="text-red-500 mt-3">
                        {error}
                    </p>

                    <button
                        onClick={loadUsers}
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
        <div className="space-y-6">

            {/* Header */}

            <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-lg p-8 text-white">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div>

                        <p className="text-indigo-100 uppercase tracking-wider text-sm font-semibold">
                            Administration
                        </p>

                        <h1 className="text-4xl font-bold mt-2">
                            User Management
                        </h1>

                        <p className="text-indigo-100 mt-3">
                            Manage candidates, recruiters and administrators.
                        </p>

                    </div>


                    <button
                        onClick={loadUsers}
                        className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 font-semibold transition"
                    >
                        ↻ Refresh
                    </button>

                </div>

            </div>


            {/* Update Error */}

            {updateError && (

                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4">
                    {updateError}
                </div>

            )}


            {/* Filters */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Search */}

                    <div className="lg:col-span-1">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search Users
                        </label>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search username or email..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>


                    {/* Role Filter */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Role
                        </label>

                        <select
                            value={roleFilter}
                            onChange={(event) =>
                                setRoleFilter(
                                    event.target.value
                                )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >

                            <option value="all">
                                All Roles
                            </option>

                            <option value="candidate">
                                Candidates
                            </option>

                            <option value="recruiter">
                                Recruiters
                            </option>

                            <option value="admin">
                                Administrators
                            </option>

                        </select>

                    </div>


                    {/* Status Filter */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Status
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >

                            <option value="all">
                                All Statuses
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>

                    </div>


                    {/* Clear */}

                    <div className="flex items-end">

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="w-full px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition"
                        >
                            Clear Filters
                        </button>

                    </div>

                </div>

            </div>


            {/* Users */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="p-6 border-b border-gray-100">

                    <h2 className="text-xl font-bold text-gray-900">
                        All Users
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Showing{" "}
                        {filteredUsers.length}{" "}
                        of{" "}
                        {users.length}{" "}
                        users
                    </p>

                </div>


                {filteredUsers.length === 0 ? (

                    <div className="p-12 text-center">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
                            🔍
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mt-5">
                            No matching users
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Try changing your search, role or status filter.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        ID
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Username
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Email
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Role
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Account Action
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Created
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-gray-100">

                                {filteredUsers.map((user) => {

                                    const isMainAdmin =
                                        user.is_staff &&
                                        user.role === "admin";

                                    const isUpdating =
                                        updatingId ===
                                        user.id;


                                    return (

                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 transition"
                                        >

                                            {/* ID */}

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {user.id}
                                            </td>


                                            {/* Username */}

                                            <td className="px-6 py-4">

                                                <p className="font-semibold text-gray-900">
                                                    {user.username}
                                                </p>

                                            </td>


                                            {/* Email */}

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {user.email}
                                            </td>


                                            {/* Role */}

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getRoleStyle(
                                                        user.role
                                                    )}`}
                                                >
                                                    {user.role}
                                                </span>

                                            </td>


                                            {/* Status */}

                                            <td className="px-6 py-4">

                                                {user.is_active ? (

                                                    <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                                                        Active
                                                    </span>

                                                ) : (

                                                    <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">
                                                        Inactive
                                                    </span>

                                                )}

                                            </td>


                                            {/* Account Action */}

                                            <td className="px-6 py-4">

                                                {isMainAdmin ? (

                                                    <span className="text-sm text-gray-400">
                                                        Protected
                                                    </span>

                                                ) : (

                                                    <select
                                                        value={
                                                            user.is_active
                                                                ? "active"
                                                                : "inactive"
                                                        }
                                                        disabled={
                                                            isUpdating
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            handleStatusChange(
                                                                user,
                                                                event.target.value
                                                            )
                                                        }
                                                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    >

                                                        <option value="active">
                                                            Active
                                                        </option>

                                                        <option value="inactive">
                                                            Inactive
                                                        </option>

                                                    </select>

                                                )}

                                                {isUpdating && (

                                                    <p className="text-xs text-indigo-600 mt-2">
                                                        Updating...
                                                    </p>

                                                )}

                                            </td>


                                            {/* Created */}

                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">

                                                {user.created_at
                                                    ? new Date(
                                                        user.created_at
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )
                                                    : "-"}

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};


export default AdminUsers;