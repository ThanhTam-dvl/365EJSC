import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Join from "./pages/Join";
import Chat from "./pages/Chat";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* User Routes với Navbar */}
        <Route path="/*" element={
          <div>
            <Navbar />
            <div className="p-4 max-w-3xl mx-auto">
              <Routes>
                <Route path="/" element={<Join />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          </div>
        } />
        
        {/* Admin Routes không có Navbar user */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App