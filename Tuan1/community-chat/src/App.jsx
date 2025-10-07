import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Join from "./pages/Join";
import Chat from "./pages/Chat";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <div className="min-h-screen bg-gray-50">

        <Navbar />
        <div className="p-4 max-w-3xl mx-auto">
          <Routes>
            <Route path="/" element={<Join />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/about" element={<About />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin/>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard/>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </div>
  );
}

export default App
