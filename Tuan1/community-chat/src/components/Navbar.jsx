import { Link } from "react-router-dom";

export default function Navbar() {
  const isAdmin = localStorage.getItem('adminToken') === 'admin-authenticated';

  return (
    <nav className="bg-blue-100 border-b border-blue-200 p-4 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <Link to="/chat" className="font-bold text-lg text-blue-800 hover:text-blue-600">
         TaZi Community Chat
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800">Join</Link>
          <Link to="/chat" className="text-blue-600 hover:text-blue-800">Chat</Link>
          <Link to="/about" className="text-blue-600 hover:text-blue-800">About</Link>

          {/* Admin Link */}
          {isAdmin ? (
            <Link to="/admin" className="text-green-600 hover:text-green-800 font-semibold">
              Admin
            </Link>
          ) : (
            <Link to="/admin/login" className="text-blue-600 hover:text-blue-800">
              Admin
            </Link>
          )}
        
        </div>
      </div>
    </nav>
  );
}