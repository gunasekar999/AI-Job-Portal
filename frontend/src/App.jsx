import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";


import Login from "./pages/auth/Login";

import DashboardLayout from "./components/layout/DashboardLayout";

import AuthRoute from "./components/auth/AuthRoute";
import RoleRoute from "./components/auth/RoleRoute";


import RecruiterApplications from "./pages/applications/RecruiterApplications";
import RecruiterJobs from "./pages/jobs/RecruiterJobs";

import Companies from "./pages/companies/Companies";
import Applications from "./pages/applications/Applications";

import Jobs from "./pages/jobs/Jobs";
import JobDetails from "./pages/jobs/JobDetails";

import RoleDashboard from "./pages/dashboard/RoleDashboard";

import Profile from "./pages/profile/Profile";

import MyAIMatches from "./pages/ai/MyAIMatches";

import ResumeUpload from "./pages/ai/ResumeUpload";
import JobRecommendations from "./pages/ai/JobRecommendations";
import InterviewQuestions from "./pages/ai/InterviewQuestions";

import AdminUsers from "./pages/admin/AdminUsers";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminApplications from "./pages/admin/AdminApplications";


function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* ============================================================ */}
                {/* PUBLIC ROUTES */}
                {/* ============================================================ */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* ============================================================ */}
                {/* ROOT */}
                {/* ============================================================ */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />


                {/* ============================================================ */}
                {/* DASHBOARD */}
                {/* Candidate + Recruiter + Admin */}
                {/* ============================================================ */}

                <Route
                    path="/dashboard"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <RoleDashboard />

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* PROFILE */}
                {/* Candidate + Recruiter */}
                {/* ============================================================ */}

                <Route
                    path="/profile"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <Profile />

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* ADMIN USERS */}
                {/* Admin Only */}
                {/* ============================================================ */}

                <Route
                    path="/admin/users"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <RoleRoute
                                    allowedRoles={[
                                        "admin",
                                    ]}
                                >

                                    <AdminUsers />

                                </RoleRoute>

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* ADMIN COMPANIES */}
                {/* Admin Only */}
                {/* ============================================================ */}

                <Route
                    path="/admin/companies"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <RoleRoute
                                    allowedRoles={[
                                        "admin",
                                    ]}
                                >

                                    <AdminCompanies />

                                </RoleRoute>

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* ADMIN JOBS */}
                {/* Admin Only */}
                {/* ============================================================ */}

                <Route
                    path="/admin/jobs"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <RoleRoute
                                    allowedRoles={[
                                        "admin",
                                    ]}
                                >

                                    <AdminJobs />

                                </RoleRoute>

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* ADMIN APPLICATIONS */}
                {/* Admin Only */}
                {/* ============================================================ */}

                <Route
                    path="/admin/applications"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <RoleRoute
                                    allowedRoles={[
                                        "admin",
                                    ]}
                                >

                                    <AdminApplications />

                                </RoleRoute>

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* AI - RESUME */}
                {/* Candidate Only */}
                {/* ============================================================ */}

                <Route
                    path="/ai/resume"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <RoleRoute
                                    allowedRoles={[
                                        "candidate",
                                    ]}
                                >

                                    <ResumeUpload />

                                </RoleRoute>

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* AI - RECOMMENDATIONS */}
                {/* Candidate Only */}
                {/* ============================================================ */}

                <Route
                    path="/ai/recommendations"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <RoleRoute
                                    allowedRoles={[
                                        "candidate",
                                    ]}
                                >

                                    <JobRecommendations />

                                </RoleRoute>

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* AI - INTERVIEW QUESTIONS */}
                {/* Candidate Only */}
                {/* ============================================================ */}

                <Route
                    path="/ai/interview-questions"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <RoleRoute
                                    allowedRoles={[
                                        "candidate",
                                    ]}
                                >

                                    <InterviewQuestions />

                                </RoleRoute>

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* JOBS */}
                {/* Candidate + Recruiter */}
                {/* ============================================================ */}

                <Route
                    path="/jobs"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <Jobs />

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* JOB DETAILS */}
                {/* Candidate + Recruiter */}
                {/* ============================================================ */}

                <Route
                    path="/jobs/:id"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <JobDetails />

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* CANDIDATE APPLICATIONS */}
                {/* Candidate Only */}
                {/* ============================================================ */}

                <Route
                    path="/applications"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <RoleRoute
                                    allowedRoles={[
                                        "candidate",
                                    ]}
                                >

                                    <Applications />

                                </RoleRoute>

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* COMPANIES */}
                {/* Candidate + Recruiter */}
                {/* ============================================================ */}

                <Route
                    path="/companies"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <Companies />

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* RECRUITER JOBS */}
                {/* Recruiter Only */}
                {/* ============================================================ */}

                <Route
                    path="/recruiter/jobs"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <RoleRoute
                                    allowedRoles={[
                                        "recruiter",
                                    ]}
                                >

                                    <RecruiterJobs />

                                </RoleRoute>

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* RECRUITER APPLICATIONS */}
                {/* Recruiter Only */}
                {/* ============================================================ */}

                <Route
                    path="/recruiter/applications"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <RoleRoute
                                    allowedRoles={[
                                        "recruiter",
                                    ]}
                                >

                                    <RecruiterApplications />

                                </RoleRoute>

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* AI MATCHES */}
                {/* Candidate Only */}
                {/* ============================================================ */}

                <Route
                    path="/ai/matches"
                    element={
                        <AuthRoute>

                            <DashboardLayout>

                                <RoleRoute
                                    allowedRoles={[
                                        "candidate",
                                    ]}
                                >

                                    <MyAIMatches />

                                </RoleRoute>

                            </DashboardLayout>

                        </AuthRoute>
                    }
                />


                {/* ============================================================ */}
                {/* 404 */}
                {/* ============================================================ */}

                <Route
                    path="*"
                    element={

                        <div className="min-h-screen flex items-center justify-center bg-slate-100">

                            <div className="text-center">

                                <h1 className="text-7xl font-bold text-blue-600">
                                    404
                                </h1>

                                <p className="text-gray-500 mt-4 text-lg">
                                    Page Not Found
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        window.location.href =
                                        "/dashboard"
                                    }
                                    className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                                >
                                    Go to Dashboard
                                </button>

                            </div>

                        </div>

                    }
                />


            </Routes>

        </BrowserRouter>
    );
}


export default App;