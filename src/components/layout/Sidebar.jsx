import { Link, useLocation } from "react-router-dom";
import { useContext, useMemo } from "react";
import { AuthContext } from "../../AuthContext";

function Sidebar() {
  const { user } = useContext(AuthContext) || {};
  const location = useLocation();

  const role = user?.role || "student";

  const links = useMemo(() => {
    const common = [{ path: "/dashboard", label: "Dashboard" }];

    if (role === "admin") {
      return [...common, { path: "/admin/analytics", label: "Analytics" }];
    }

    if (role === "faculty") {
      return [...common, { path: "/faculty/sessions", label: "Sessions" }];
    }

    return [...common, { path: "/student/attendance", label: "My Attendance" }];
  }, [role]);

  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200 min-h-screen p-4">
      <ul className="flex flex-col gap-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`block px-3 py-2 rounded text-sm transition ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
