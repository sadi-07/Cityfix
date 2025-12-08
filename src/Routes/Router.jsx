import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Auth/Login";
import AllIssues from "../Pages/AllIssues/AllIssues";
import About from "../Pages/Home/About";
import ContactUs from "../Pages/Home/ContactUs";
import Error404 from "../Components/Shared/Error404";

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
      {
        path: "*",
        element: <Error404></Error404>,
      },
    ]
  }
]);

export default router;
