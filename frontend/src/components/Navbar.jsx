import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, logout }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🔐 WebSec
        </Link>
        
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <Link to="/change-password" className="nav-link">
                Change Password
              </Link>
              <Link to="/password-validator" className="nav-link">
                Password Validator
              </Link>
              <button 
                onClick={logout}
                className="btn btn-secondary nav-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/password-validator" className="nav-link">
                Password Validator
              </Link>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary nav-register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
