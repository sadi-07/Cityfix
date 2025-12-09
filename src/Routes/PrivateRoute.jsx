import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Context/AuthProvider";
import Loading from "../Components/Shared/Loading";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    
    if (loading) {
        return <Loading />;
    }

    
    if (!user) {
        return <Navigate to="/login" state={location.pathname} replace />;
    }

    
    return children;
};

export default PrivateRoute;
