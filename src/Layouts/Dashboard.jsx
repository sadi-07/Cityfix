import React, { useContext } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router";
import logoWhite from "../assets/logo-white-removebg-preview.png";
import { AuthContext } from "../Context/AuthProvider";

// Import dashboards
import AdminDashboard from "../Pages/Dashboard/Admin/AdminDashboard";
import CitizenDashboard from "../Pages/Dashboard/Citizen/CitizenDashboard";
import StaffDashboard from "../Pages/Dashboard/Staff/StaffDashboard";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Function to auto-select dashboard home content
  const renderDashboardHome = () => {
    if (location.pathname !== "/dashboard") return null;

    if (user?.role === "admin") return <AdminDashboard />;
    if (user?.role === "staff") return <StaffDashboard />;
    return <CitizenDashboard />;
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5 hidden md:block">
        <Link to="/dashboard">
          <img className="h-18 w-45 mx-auto mb-10" src={logoWhite} alt="" />
        </Link>

        <nav className="flex flex-col gap-3">
          {/* Common link */}
          {/* <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
            }
          >
            My Profile
          </NavLink> */}

          {/* Citizen Links */}
          {user?.role === "citizen" && (
            <>
              <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
            }
          >
            My Profile
          </NavLink>

              <NavLink
                to="/dashboard/report-issue"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                }
              >
                Report Issue
              </NavLink>

              <NavLink
                to="/dashboard/my-issues"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                }
              >
                My Issues
              </NavLink>
            </>
          )}

          {/* Staff Links */}
          {user?.role === "staff" && (
            <>
            <NavLink
            to="/dashboard/staff-profile"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
            }
          >
            My Profile
          </NavLink>
            <NavLink
              to="/dashboard/assigned-issues"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
              }
            >
              Assigned Issues
            </NavLink>
            </>
          )}

          {/* Admin Links */}
          {user?.role === "admin" && (
            <>
              <NavLink
            to="/dashboard/admin-profile"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
            }
          >
            My Profile
          </NavLink>

              <NavLink
                to="/dashboard/all-issues"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                }
              >
                All Issues
              </NavLink>

              <NavLink
                to="/dashboard/manage-users"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                }
              >
                Manage Users
              </NavLink>

              <NavLink
                to="/dashboard/manage-staffs"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                }
              >
                Manage Staff
              </NavLink>

              <NavLink
                to="/dashboard/payments"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                }
              >
                Payments
              </NavLink>
            </>
          )}

          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
            }
          >
            Back to Home
          </NavLink>
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1">
        <header className="w-full bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-950">Dashboard Panel</h1>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img
                src={user?.photoURL || "/default-avatar.png"}
                alt={user?.name || "User"}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="font-medium text-gray-700">{user?.name || "User"}</p>
          </div>
        </header>

        {/* Dashboard Home + Nested Pages */}
        <main className="p-6">
          {renderDashboardHome()}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
