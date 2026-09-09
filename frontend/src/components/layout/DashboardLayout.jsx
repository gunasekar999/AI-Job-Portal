import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-100">

            {/* Sidebar */}

            <Sidebar />

            {/* Main Section */}

            <div className="lg:ml-72 min-h-screen flex flex-col">

                {/* Top Navigation */}

                <Topbar />

                {/* Page Content */}

                <main className="flex-1 p-8">

                    {children}

                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;