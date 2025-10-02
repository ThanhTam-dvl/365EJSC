
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ isAuth, children }) {
  return isAuth ? children : <Navigate to="/login" />;
}
