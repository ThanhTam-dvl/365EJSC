import { Outlet, Link } from 'react-router-dom';

export function About() {
  return (
    <div>
        <h2>About Page - <span>Learn more about demo us</span></h2>
        <nav>
            <Link to="team">Team</Link> | 
            <Link to="company">Company</Link>
        </nav>
        <Outlet />
    </div>
  );
}
