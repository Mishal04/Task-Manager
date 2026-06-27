import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

function DashboardLayout({ children, search, setSearch }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <div className="p-6">
          <Navbar
            search={search}
            setSearch={setSearch}
          />
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 px-6 pb-6">
          {children}
        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;