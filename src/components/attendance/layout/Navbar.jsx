import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">Attendify</h1>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm">Hey, {user.name || user.email}</span>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
