import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../store/storeContext";

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
