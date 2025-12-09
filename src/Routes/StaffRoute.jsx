import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Context/AuthProvider";
import toast from "react-hot-toast";
import Loading from "../Components/Shared/Loading";

const StaffRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Loading></Loading>;
  }

  if (user?.role === "staff") {
    return children;
  } else {
    toast.error("Access denied! Staff only.");
    return <Navigate to="/" state={{ from: location }} replace />;
  }
};

export default StaffRoute;
