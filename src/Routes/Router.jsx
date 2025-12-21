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
import AdminRoute from "./AdminRoute";
import StaffRoute from "./StaffRoute";
import AllIssuesAdmin from "../Pages/Dashboard/Admin/AllIssuesAdmin";
import ManageStaffs from "../Pages/Dashboard/Admin/ManageStaffs";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
import AssignedIssues from "../Pages/Dashboard/Staff/AssignedIssues";
import IssueDetails from "../Pages/AllIssues/IssueDetails";
import PaymentsPage from "../Pages/Dashboard/Admin/Payments";
import AdminProfile from "../Pages/Dashboard/Admin/AdminProfile";
import StaffProfile from "../Pages/Dashboard/Staff/StaffProfile";
import PaymentSuccess from "../Payment/PaymentSuccess";
import PaymentCancel from "../Payment/PaymentCancel";



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/all-issues", element: <AllIssues /> },
      { path: "/issues/:id", element: 
      <PrivateRoute>
        <IssueDetails></IssueDetails>
      </PrivateRoute> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <ContactUs /> },
      { path: "*", element: <Error404 /> },
    ],
  },

  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Register /> },

  // Dashboard Route
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
      { path: "payment-success", element: <PaymentSuccess />},
      { path: "payment-cancelled", element: <PaymentCancel />},

      // Staff
      { path: "assigned-issues", element: <StaffRoute><AssignedIssues /></StaffRoute> },
      { path: "staff-profile", element: <StaffRoute><StaffProfile /></StaffRoute> },

      // Admin
      { path: "all-issues", element: <AdminRoute><AllIssuesAdmin /></AdminRoute> },
      { path: "manage-users", element: <AdminRoute><ManageUsers /></AdminRoute> },
      { path: "manage-staffs", element: <AdminRoute><ManageStaffs /></AdminRoute> },
      { path: "payments", element: <AdminRoute><PaymentsPage /></AdminRoute> },
      { path: "admin-profile", element: <AdminRoute><AdminProfile /></AdminRoute> },

    ],
  },
]);

export default router;
