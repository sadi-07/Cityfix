import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Auth/Login";
import AllIssues from "../Pages/AllIssues/AllIssues";
import About from "../Pages/Home/About";
import ContactUs from "../Pages/Home/ContactUs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { 
        path: "/",
        element: <Home />
      },
      { 
        path: "/login",
        element: <Login />
      },
      { 
        path: "/all-issues",
        element: <AllIssues></AllIssues>
      },
      { 
        path: "/about",
        element: <About></About>
      },
      { 
        path: "/contact",
        element: <ContactUs></ContactUs>
      },
    ]
  }
]);

export default router;
