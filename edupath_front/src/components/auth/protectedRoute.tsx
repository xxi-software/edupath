import { Navigate } from "react-router";

/**
 * Ruta protegida que requiere un token en localStorage.
 * Si no hay token, redirige a la pantalla de inicio de sesión.
 */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = window.localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
};
