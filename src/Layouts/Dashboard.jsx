import React, { useContext } from "react";
import { Outlet, NavLink, Link } from "react-router";
import Logo from "../Components/Shared/Logo";
import logoWhite from "../assets/logo-white-removebg-preview.png";
import { AuthContext } from "../Context/AuthProvider";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  console.log(user.role);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5 hidden md:block">
        <Link to="/">
          <img className="h-18 w-45 mx-auto mb-10" src={logoWhite} alt="" />
        </Link>

        <nav className="flex flex-col gap-3">
          {/* Common links for all roles */}
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            My Profile
          </NavLink>

          {/* Role-based Links */}
          {user?.role === "citizen" && (
            <>
              <NavLink
                to="/dashboard/report-issue"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                Report Issue
              </NavLink>
              <NavLink
                to="/dashboard/my-issues"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                My Issues
              </NavLink>
            </>
          )}

          {user?.role === "staff" && (
            <>
              <NavLink
                to="/dashboard/assigned-issues"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                Assigned Issues
              </NavLink>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink
                to="/dashboard/all-issues"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                All Issues
              </NavLink>
              <NavLink
                to="/dashboard/manage-users"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                Manage Users
              </NavLink>
              <NavLink
                to="/dashboard/manage-staff"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                Manage Staff
              </NavLink>
              <NavLink
                to="/dashboard/payments"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                Payments
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Topbar */}
        <header className="w-full bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-950">Dashboard Panel</h1>

          {/* User badge */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img
                src={user?.photoURL || "/default-avatar.png"}
                alt={user?.name || "User"}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="font-medium text-gray-700">{user?.role || "User"}</p>
          </div>
        </header>

        {/* Dynamic content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
