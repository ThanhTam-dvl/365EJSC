import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const isAdmin = localStorage.getItem('adminToken') === 'admin-authenticated';

    return isAdmin ? children : <Navigate to="/admin/login" replace />;
}