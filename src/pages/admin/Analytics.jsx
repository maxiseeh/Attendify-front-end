import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

// analytics page - only admins can see this

function Analytics() {
  // TODO: fetch real data from backend

  const dummyData = [
    { course: "CS101", total: 20, attended: 18, percent: "90%" },
    { course: "MATH201", total: 15, attended: 12, percent: "80%" },
    { course: "ENG301", total: 18, attended: 14, percent: "78%" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Attendance Analytics
          </h2>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    Course
                  </th>

                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    Total Sessions
                  </th>

                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    Attended
                  </th>

                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    Percentage
                  </th>
                </tr>
              </thead>

              <tbody>
                {dummyData.map((row) => (
                  <tr
                    key={row.course}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">{row.course}</td>

                    <td className="px-4 py-3 text-gray-600">{row.total}</td>

                    <td className="px-4 py-3 text-gray-600">{row.attended}</td>

                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {row.percent}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Analytics;
