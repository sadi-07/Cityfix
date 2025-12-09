import React from "react";
import { Outlet, NavLink, Link } from "react-router";
import Logo from "../Components/Shared/Logo";
import logoWhite from "../assets/logo-white-removebg-preview.png"

const Dashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5 hidden md:block">
        <Link to="/">
            <img className="h-20 w-45 mx-auto mb-10" src={logoWhite} alt="" />
        </Link>

        <nav className="flex flex-col gap-3">
          {/* These are placeholders; you will render them based on roles later */}
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
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Topbar */}
        <header className="w-full bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-950">Dashboard Panel</h1>

          {/* Placeholder user badge */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <p className="font-medium text-gray-700">User</p>
          </div>
        </header>

        {/* Dynamic content via nested routes */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
