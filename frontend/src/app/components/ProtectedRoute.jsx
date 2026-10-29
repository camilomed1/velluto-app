import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Si no hay sesión manda a /login.
// adminOnly exige rol admin; rol="domiciliario" exige ese rol.
export function ProtectedRoute({ children, adminOnly = false, rol }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  if (rol && user.rol !== rol) return <Navigate to="/" replace />;

  return children;
}
