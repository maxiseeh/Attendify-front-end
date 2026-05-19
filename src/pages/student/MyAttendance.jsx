import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import WifiStatus from "../../components/attendance/WifiStatus";
import QRScanner from "../../components/attendance/QRScanner";
import useWifiDetect from "../../hooks/useWifiDetect";
import { getStudentAttendance } from "../../services/attendanceService";

function MyAttendance() {
  const isOnline = useWifiDetect();
  const [records, setRecords] = useState([]);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    // get attendance records for this student
    // TODO: pass actual student id from auth context
    getStudentAttendance("me")
      .then((res) => setRecords(res.data))
      .catch((err) => console.log("could not get records", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">My Attendance</h2>
            <WifiStatus isConnected={isOnline} />
          </div>

          <button
            onClick={() => setShowScanner(!showScanner)}
            className="mb-6 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
          >
            {showScanner ? "Hide Scanner" : "Scan QR to Mark Attendance"}
          </button>

          {showScanner && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 p-4">
              <QRScanner onScan={(code) => console.log("scanned:", code)} />
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    Session
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  records.map((r, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-4 py-3">{r.session}</td>
                      <td className="px-4 py-3 text-gray-500">{r.date}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            r.status === "present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyAttendance;
