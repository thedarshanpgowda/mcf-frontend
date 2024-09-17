import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export const AuthenticatedRoute = () => {
  const { authUser } = useAuthContext();
  return authUser ? <Outlet /> : <Navigate to="/login" />;
};

export const UnauthenticatedRoute = () => {
  const { authUser } = useAuthContext();
  return !authUser ? <Outlet /> : <Navigate to="/" />;
};

export const Level2Route = () => {
  const { authUser } = useAuthContext();
  return authUser?.level === 2 ? <Outlet /> : <Navigate to="/" />;
};
