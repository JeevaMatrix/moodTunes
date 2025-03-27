import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';


const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="logo">🎵 MoodTunes</h1>
      </div>
      <div className="navbar-right">
        <span className="welcome">Welcome, {user? user.user: "Guest"} 👋</span>
        <Link to="/logs" className='log-btn'>My Logs</Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
