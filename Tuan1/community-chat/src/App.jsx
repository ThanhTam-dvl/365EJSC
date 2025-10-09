// App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Join from "./pages/Join";
import Chat from "./pages/Chat";
import About from "./pages/About";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";
import NotificationContainer from "./components/NotificationContainer";
import { useTheme } from "./stores/theme.store";

function App() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <NotificationContainer />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Join />} />

          {/* User Protected Routes với Navbar */}
          <Route path="/*" element={
            <UserProtectedRoute>
              <div>
                <Navbar />
                <div className="p-4 max-w-3xl mx-auto">
                  <Routes>
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/profile" element={<Profile />} />
                   <Route path="/about" element={<About />} />
                  </Routes>
                </div>
              </div>
            </UserProtectedRoute>
          } />
          
          {/* Admin Protected Routes */}
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
    </div>
  );
}

export default App;