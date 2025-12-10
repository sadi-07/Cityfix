import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../../Context/AuthProvider";
import Loading from "../../../Components/Shared/Loading";

const backend = "http://localhost:3000";

const StaffDashboard = () => {
  const { user } = useContext(AuthContext);

  // Fetch assigned issues
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["assignedIssues", user?.email],
    queryFn: async () => {
      const res = await axios.get(`${backend}/staff/issues/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading></Loading>;

  // Stats
  const assignedCount = issues.length;
  const resolvedCount = issues.filter(i => i.status === "Resolved").length;
  const todayTasks = issues.filter(i => {
    const date = new Date(i.assignedDate).toDateString();
    return date === new Date().toDateString();
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-bold">Staff Dashboard</h1>

      {/* ====== Stats Cards ====== */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-5 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Assigned Issues</h2>
          <p className="text-3xl font-bold mt-2">{assignedCount}</p>
        </div>

        <div className="p-5 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Resolved</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {resolvedCount}
          </p>
        </div>

        <div className="p-5 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Today's Tasks</h2>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {todayTasks.length}
          </p>
        </div>
      </div>

      {/* ====== Basic Bar Chart (PURE CSS) ====== */}
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Weekly Workload</h2>

        <div className="flex items-end gap-4 h-40">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
            const count = issues.filter(
              (i) => new Date(i.assignedDate).toLocaleString("en-US", { weekday: "short" }) === day
            ).length;

            const barHeight = Math.min(count * 20, 120); // max 120px

            return (
              <div key={day} className="flex flex-col items-center">
                <div
                  className="w-10 bg-blue-500 rounded transition-all"
                  style={{ height: `${barHeight}px` }}
                ></div>
                <p className="text-sm mt-2">{day}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ====== Today’s Tasks List ====== */}
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Tasks for Today</h2>

        {todayTasks.length === 0 ? (
          <p className="text-gray-500">No tasks for today.</p>
        ) : (
          <ul className="space-y-4">
            {todayTasks.map((task) => (
              <li
                key={task._id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <h3 className="font-bold">{task.title}</h3>
                <p className="text-gray-600">{task.location}</p>
                <p className="text-xs mt-1">
                  Priority:{" "}
                  <span
                    className={`px-2 py-1 rounded ${
                      task.priority === "High"
                        ? "bg-red-200"
                        : "bg-blue-200"
                    }`}
                  >
                    {task.priority}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
