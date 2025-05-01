// src/components/Navbar.js
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/main.css';

export default function Navbar() {
  const { isLoggedIn, isAdmin, currentUser, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">Blog Platform</Link>
        
        <div className="nav-links">
          {isLoggedIn ? (
            <>
              {/* Show admin link only for admin users */}
              {isAdmin && (
                <Link to="/admin" className="nav-link">Admin</Link>
              )}
              
              <span className="nav-greeting">Hello, {currentUser?.username || 'User'}</span>
              
              <button 
                onClick={logout} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
