import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Auth/Login";
import AllIssues from "../Pages/AllIssues/AllIssues";
import About from "../Pages/Home/About";
import ContactUs from "../Pages/Home/ContactUs";
import Error404 from "../Components/Shared/Error404";
import Register from "../Pages/Auth/Register";
import PrivateRoute from "./PrivateRoute";

// Dashboard Layout
import Dashboard from "../Layouts/Dashboard";
import Profile from "../Pages/Dashboard/Citizen/Profile";
import MyIssues from "../Pages/Dashboard/Citizen/MyIssues";
import ReportIssue from "../Pages/Dashboard/Citizen/ReportIssue";



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/all-issues", element: <AllIssues /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <ContactUs /> },
      { path: "*", element: <Error404 /> },
    ],
  },

  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Register /> },

  // 🔥 Dashboard Route (Protected)
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),

    children: [
       { path: "profile", element: <Profile /> },
       { path: "report-issue", element: <ReportIssue /> },
       { path: "my-issues", element: <MyIssues /> },

      // ⚠ Admin/staff pages can be added later
      // { path: "all-users", element: <AdminRoute><AllUsers /></AdminRoute> },
      // { path: "assigned-issues", element: <StaffRoute><AssignedIssues /></StaffRoute> },
    ],
  },
]);

export default router;
