import React, { useContext, useState } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router";
import logoWhite from "../assets/logo-white-removebg-preview.png";
import { AuthContext } from "../Context/AuthProvider";
import { Banknote, Contact, FolderOpen, LayoutDashboard, ListTodo, MessageSquareWarning, ReceiptText, UserCircle, UsersRound, Menu } from "lucide-react";

// Import dashboards
import AdminDashboard from "../Pages/Dashboard/Admin/AdminDashboard";
import CitizenDashboard from "../Pages/Dashboard/Citizen/CitizenDashboard";
import StaffDashboard from "../Pages/Dashboard/Staff/StaffDashboard";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Function to auto-select dashboard home content
  const renderDashboardHome = () => {
    if (location.pathname !== "/dashboard") return null;

    if (user?.role === "admin") return <AdminDashboard />;
    if (user?.role === "staff") return <StaffDashboard />;
    return <CitizenDashboard />;
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar for lg+ screens */}
      <aside className="w-64 bg-gray-900 text-white p-5 hidden lg:block">
        <Link to="/">
          <img className="h-18 w-45 mx-auto mb-10" src={logoWhite} alt="" />
        </Link>

        <nav className="flex flex-col gap-3">
          {/* Citizen Links */}
          {user?.role === "citizen" && (
            <>
              <NavLink
                to="/dashboard/profile"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-2`
                }
              >
                <UserCircle /> My Profile
              </NavLink>

              <NavLink
                to="/dashboard/report-issue"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-3`
                }
              >
                <MessageSquareWarning /> Report Issue
              </NavLink>

              <NavLink
                to="/dashboard/my-issues"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-3`
                }
              >
                <FolderOpen /> My Issues
              </NavLink>
            </>
          )}

          {/* Staff Links */}
          {user?.role === "staff" && (
            <>
              <NavLink
                to="/dashboard/staff-profile"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-3`
                }
              >
                <UserCircle /> My Profile
              </NavLink>
              <NavLink
                to="/dashboard/assigned-issues"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-3`
                }
              >
                <ListTodo /> Assigned Issues
              </NavLink>
            </>
          )}

          {/* Admin Links */}
          {user?.role === "admin" && (
            <>
              <NavLink
                to="/dashboard/admin-profile"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-3`
                }
              >
                <UserCircle /> My Profile
              </NavLink>

              <NavLink
                to="/dashboard/all-issues"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-3`
                }
              >
                <ReceiptText /> All Issues
              </NavLink>

              <NavLink
                to="/dashboard/manage-users"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-3`
                }
              >
                <Contact /> Manage Users
              </NavLink>

              <NavLink
                to="/dashboard/manage-staffs"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-3`
                }
              >
                <UsersRound /> Manage Staff
              </NavLink>

              <NavLink
                to="/dashboard/payments"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-3`
                }
              >
                <Banknote /> Payments
              </NavLink>
            </>
          )}

          <NavLink
            to="/dashboard"
            className="px-4 py-3 rounded-lg hover:bg-gray-800 flex gap-3"
          >
            <LayoutDashboard /> Back to Dashboard
          </NavLink>
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1">
        <header className="w-full bg-white shadow p-4 flex justify-between items-center">
          {/* Mobile hamburger button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border rounded hover:bg-gray-200"
            >
              <Menu />
            </button>
            <h1 className="text-3xl font-extrabold text-gray-950">Dashboard Panel</h1>
          </div>

          {/* Desktop title */}
          <h1 className="hidden lg:block text-4xl font-extrabold text-gray-950">
            Dashboard Panel
          </h1>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img
                src={user?.photoURL || "https://i.ibb.co.com/JFSJBVwM/user.png"}
                alt={user?.name || "User"}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="font-semibold text-xl text-gray-800">{user?.name || "User"}</p>
          </div>
        </header>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-900 text-white p-4">
            <nav className="flex flex-col gap-2">
              {/* Render all nav links same as sidebar */}
              {user?.role === "citizen" && (
                <>
                  <NavLink
                    to="/dashboard/profile"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-2`
                    }
                  >
                    <UserCircle /> My Profile
                  </NavLink>
                  <NavLink
                    to="/dashboard/report-issue"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-2`
                    }
                  >
                    <MessageSquareWarning /> Report Issue
                  </NavLink>
                  <NavLink
                    to="/dashboard/my-issues"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-2`
                    }
                  >
                    <FolderOpen /> My Issues
                  </NavLink>
                </>
              )}

              {user?.role === "staff" && (
                <>
                  <NavLink
                    to="/dashboard/staff-profile"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-2`
                    }
                  >
                    <UserCircle /> My Profile
                  </NavLink>
                  <NavLink
                    to="/dashboard/assigned-issues"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-2`
                    }
                  >
                    <ListTodo /> Assigned Issues
                  </NavLink>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <NavLink
                    to="/dashboard/admin-profile"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-2`
                    }
                  >
                    <UserCircle /> My Profile
                  </NavLink>
                  <NavLink
                    to="/dashboard/all-issues"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-2`
                    }
                  >
                    <ReceiptText /> All Issues
                  </NavLink>
                  <NavLink
                    to="/dashboard/manage-users"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-2`
                    }
                  >
                    <Contact /> Manage Users
                  </NavLink>
                  <NavLink
                    to="/dashboard/manage-staffs"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-2`
                    }
                  >
                    <UsersRound /> Manage Staff
                  </NavLink>
                  <NavLink
                    to="/dashboard/payments"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"} flex gap-2`
                    }
                  >
                    <Banknote /> Payments
                  </NavLink>
                </>
              )}

              <NavLink
                to="/dashboard"
                className="px-4 py-2 rounded hover:bg-gray-800 flex gap-2"
              >
                <LayoutDashboard /> Back to Dashboard
              </NavLink>
            </nav>
          </div>
        )}

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
