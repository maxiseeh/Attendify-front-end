import { useState, useContext, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import SessionCard from "../../components/attendance/SessionCard";
import Modal from "../../components/common/Modal";
import { AttendanceContext } from "../../AttendanceContext";

// faculty can create and manage their attendance sessions here

function SessionManager() {
  const { sessions, loading, fetchSessions } = useContext(AttendanceContext);

  const [showModal, setShowModal] = useState(false);
  const [sessionName, setSessionName] = useState("");

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleCreate = () => {
    // send to backend

    console.log("creating session:", sessionName);

    setShowModal(false);
    setSessionName("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Session Manager</h2>

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              + New Session
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500 text-sm">Loading sessions...</p>
          ) : sessions?.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No sessions yet. Create one!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions?.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Session"
      >
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">
            Session Name
          </label>

          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="e.g. CS101 - Week 3"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default SessionManager;
