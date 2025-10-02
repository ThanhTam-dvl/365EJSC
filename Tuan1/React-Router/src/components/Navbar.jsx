import React from 'react'
import { Link } from 'react-router-dom'

export function Navbar () {
  return (
    <nav style={{padding: "10px", borderBottom: "1px solid #ccc"}}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/users/1">User 1</Link>
        <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}
