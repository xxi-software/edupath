import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = window.localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
};
