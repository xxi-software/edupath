import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/authSlice";

/**
 * Ruta protegida que requiere un usuario autenticado en el estado de Redux.
 * Si no hay usuario autenticado, redirige a la pantalla de inicio de sesión.
 */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return children;
};
