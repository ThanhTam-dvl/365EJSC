// components/UserProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../stores/auth.store";

export default function UserProtectedRoute({ children }) {
  const { isAuthenticated, isGuestMode } = useAuth();
  const username = localStorage.getItem("username");

  // Cho phép truy cập nếu đã authenticated HOẶC đang dùng guest mode
  return (isAuthenticated || isGuestMode || username) ? children : <Navigate to="/" replace />;
}