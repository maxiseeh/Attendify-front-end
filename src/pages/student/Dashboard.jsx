import { useContext } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { AuthContext } from "../../AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Welcome back
            {user?.name ? `, ${user.name}` : ""}!
          </h2>

          <p className="text-gray-500 text-sm">
            Here's your attendance overview.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-500">Total Sessions</p>

              <p className="text-2xl font-bold text-blue-600 mt-1">12</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-500">Attended</p>

              <p className="text-2xl font-bold text-green-600 mt-1">10</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-500">Absent</p>

              <p className="text-2xl font-bold text-red-500 mt-1">2</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
