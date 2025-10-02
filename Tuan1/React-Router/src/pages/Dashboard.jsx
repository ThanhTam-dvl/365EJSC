import { Outlet, Link, useNavigate } from 'react-router-dom';


export function Dashboard({onLogout}) {
  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div>
        <h2>Dashboard Page - only user can login on there</h2>
        <nav>
            <Link to="stats">Stats</Link>
            <Link to="settings">Settings</Link>
            <button onClick={handleLogout}>Logout</button>
        </nav>
        <Outlet />
    </div>
  );
}
